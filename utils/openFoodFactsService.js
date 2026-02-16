// utils/openFoodFactsService.js
const https = require('https');

const USER_AGENT = 'RecipeApp/1.0 (contact@example.com)';

// ─── USDA FoodData Central ───

/**
 * Fetch multiple scored results from USDA FoodData Central.
 * Returns array of { name, calories, proteins, carbs, fats, score, source }.
 */
function fetchFromUSDAMultiple(ingredientName) {
  return new Promise((resolve) => {
    const apiKey = process.env.USDA_API_KEY || 'DEMO_KEY';
    const searchTerm = encodeURIComponent(ingredientName);
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${searchTerm}&dataType=Foundation,SR%20Legacy&pageSize=10&api_key=${apiKey}`;

    httpsGet(url, (err, data) => {
      if (err || !data) return resolve([]);

      try {
        const result = JSON.parse(data);
        const foods = result.foods || [];

        const scored = foods.map(food => {
          const fnList = food.foodNutrients || [];

          const kcalEntry = fnList.find(n => n.nutrientName === 'Energy' && n.unitName === 'KCAL');
          const kjEntry = fnList.find(n => n.nutrientName === 'Energy' && n.unitName === 'kJ');
          const energyKcal = kcalEntry ? kcalEntry.value
            : kjEntry ? Math.round(kjEntry.value / 4.184)
            : null;
          if (energyKcal === null) return null;

          const getNutrient = (name) => {
            const entry = fnList.find(n => n.nutrientName === name);
            return entry ? entry.value : 0;
          };

          return {
            name: food.description,
            calories: Math.round(energyKcal),
            proteins: parseFloat(getNutrient('Protein').toFixed(1)),
            carbs: parseFloat(getNutrient('Carbohydrate, by difference').toFixed(1)),
            fats: parseFloat(getNutrient('Total lipid (fat)').toFixed(1)),
            score: nameMatchScore(ingredientName, food.description),
            source: 'USDA',
          };
        }).filter(Boolean);

        scored.sort((a, b) => b.score - a.score);
        resolve(scored);
      } catch (e) {
        console.error('Error parsing USDA response:', e.message);
        resolve([]);
      }
    });
  });
}

// ─── OpenFoodFacts ───

/**
 * Fetch multiple scored results from OpenFoodFacts.
 * Returns array of { name, calories, proteins, carbs, fats, score, source }.
 */
function fetchFromOFFMultiple(ingredientName) {
  return new Promise((resolve) => {
    const searchTerm = encodeURIComponent(ingredientName);
    const url = `https://search.openfoodfacts.org/search?q=${searchTerm}&fields=product_name,nutriments&page_size=20`;

    httpsGet(url, (err, data) => {
      if (err || !data) return resolve([]);

      try {
        const result = JSON.parse(data);
        const products = result.hits || result.products || [];

        const scored = products.map(p => {
          const n = p.nutriments;
          if (!n) return null;

          let calories = n['energy-kcal_100g'];
          if (calories === undefined && n['energy_100g'] !== undefined) {
            calories = n['energy_100g'] / 4.184;
          }
          if (calories === undefined || calories === null) return null;

          const hasProtein = n['proteins_100g'] !== undefined;
          const hasCarbs = n['carbohydrates_100g'] !== undefined;
          const hasFat = n['fat_100g'] !== undefined;
          const completeness = (hasProtein ? 1 : 0) + (hasCarbs ? 1 : 0) + (hasFat ? 1 : 0);

          return {
            name: p.product_name,
            calories: Math.round(calories || 0),
            proteins: parseFloat((n['proteins_100g'] || 0).toFixed(1)),
            carbs: parseFloat((n['carbohydrates_100g'] || 0).toFixed(1)),
            fats: parseFloat((n['fat_100g'] || 0).toFixed(1)),
            score: nameMatchScore(ingredientName, p.product_name || '') + completeness,
            source: 'OpenFoodFacts',
          };
        }).filter(Boolean);

        scored.sort((a, b) => b.score - a.score);
        resolve(scored);
      } catch (e) {
        console.error('Error parsing OpenFoodFacts response:', e.message);
        resolve([]);
      }
    });
  });
}

// ─── Single-result wrappers (backward compatible) ───

async function fetchFromUSDA(ingredientName) {
  const results = await fetchFromUSDAMultiple(ingredientName);
  if (results.length === 0) return null;
  const best = results[0];
  if (best.score < 55) return null;
  return { calories: best.calories, proteins: best.proteins, carbs: best.carbs, fats: best.fats, source: 'USDA', productName: best.name };
}

async function fetchFromOpenFoodFacts(ingredientName) {
  const results = await fetchFromOFFMultiple(ingredientName);
  if (results.length === 0) return null;
  const best = results[0];
  return { calories: best.calories, proteins: best.proteins, carbs: best.carbs, fats: best.fats, source: 'OpenFoodFacts', productName: best.name };
}

/**
 * Single best result. Tries USDA first, falls back to OpenFoodFacts.
 * Used by enrichAllIngredients (batch).
 */
async function fetchNutritionFromOpenFoodFacts(ingredientName) {
  const usdaResult = await fetchFromUSDA(ingredientName);
  if (usdaResult) return usdaResult;
  const offResult = await fetchFromOpenFoodFacts(ingredientName);
  return offResult;
}

// ─── Multi-result search (for selection UI) ───

/**
 * Search both USDA and OpenFoodFacts in parallel, merge and return top N.
 * Each result: { name, calories, proteins, carbs, fats, source }
 */
async function searchNutritionMultiple(ingredientName, limit = 5) {
  const [usdaResults, offResults] = await Promise.all([
    fetchFromUSDAMultiple(ingredientName),
    fetchFromOFFMultiple(ingredientName),
  ]);

  const merged = [...usdaResults, ...offResults];
  merged.sort((a, b) => b.score - a.score);

  // Deduplicate by normalized name
  const seen = new Set();
  const unique = merged.filter(item => {
    const key = (item.name || '').toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique.slice(0, limit).map(({ score, ...rest }) => rest);
}

// ─── Helpers ───

/**
 * Score how well a product name matches the search term.
 * Higher = better match. Prefers raw/generic ingredients over processed.
 */
function nameMatchScore(searchTerm, productName) {
  const search = searchTerm.toLowerCase().trim();
  const name = (productName || '').toLowerCase().trim();

  if (!name) return -10;

  let score = 0;

  if (name === search) {
    score = 100;
  } else if (name.startsWith(search)) {
    score = 80;
  } else {
    const searchWords = search.split(/[\s,]+/);
    const nameWords = name.split(/[\s,]+/);
    const allFound = searchWords.every(sw => nameWords.some(nw => nw.startsWith(sw)));
    score = allFound ? 70 : 40;
  }

  if (name.includes(', raw') || name === search + ' raw' || name.endsWith(' raw')) score += 20;
  if (name.includes('cru')) score += 20;
  if (name.includes('fresh') || name.includes('frais')) score += 10;
  if (name.includes('whole') && !search.includes('whole')) score += 5;
  if (name.includes('boneless') || name.includes('skinless')) score += 5;

  const processedTerms = [
    'dehydrated', 'dried', 'canned', 'frozen', 'cooked', 'fried',
    'breaded', 'baked', 'roasted', 'smoked', 'pickled', 'marinated',
    'babyfood', 'baby food', 'infant', 'juice', 'puree', 'purée',
    'powder', 'concentrate', 'crackers', 'chips', 'sauce', 'snacks',
    'cakes', 'cake', 'bagels', 'bread', 'mix', 'substitute', 'toasted',
    'glazed', 'seasoned', 'prepackaged', 'flavored', 'flavor',
    'flavour', 'flavoured', 'chocolate', 'cookie', 'bar ',
    'microwaved', 'rotisserie', 'deli', 'sliced', 'dream',
  ];
  for (const term of processedTerms) {
    if (name.includes(term)) { score -= 25; break; }
  }

  const lengthPenalty = Math.max(0, name.length - search.length - 15) * 0.3;
  score -= lengthPenalty;

  return score;
}

function httpsGet(url, callback) {
  const req = https.get(url, { headers: { 'User-Agent': USER_AGENT }, timeout: 8000 }, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      https.get(res.headers.location, { headers: { 'User-Agent': USER_AGENT }, timeout: 8000 }, (res2) => {
        collectResponse(res2, callback);
      }).on('error', (e) => callback(e, null));
      return;
    }
    collectResponse(res, callback);
  });
  req.on('error', (e) => callback(e, null));
  req.on('timeout', () => { req.destroy(); callback(new Error('timeout'), null); });
}

function collectResponse(res, callback) {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => callback(null, data));
}

module.exports = { fetchNutritionFromOpenFoodFacts, searchNutritionMultiple };
