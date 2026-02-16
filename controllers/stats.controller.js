const moment = require('moment');
const { RecipePlan, BatchSession } = require('../models/recipePlan.model');


exports.getWeeklyCalories = async (req, res) => {
    try {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() - 6); // 7 jours glissants
  
      const stats = await RecipePlan.aggregate([
        {
          $match: {
            date: { $gte: startDate },
            // parentPlanId: null, // ignore les plans "fantômes"
          }
        },
        {
          $lookup: {
            from: 'recipes',
            localField: 'recipeId',
            foreignField: '_id',
            as: 'recipe'
          }
        },
        { $unwind: '$recipe' },
        {
          $project: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            mealType: 1,
            calories: {
              $multiply: [
                { $divide: [
                  '$recipe.nutrition.calories',  // total calories for the recipe
                  '$recipe.servings'             // -> calories per portion
                ]},
                { $ifNull: ['$servings', 1] }    // multiply by plan servings
              ]
            }
          }
        },
        {
          $group: {
            _id: { date: '$date', mealType: '$mealType' },
            totalCalories: { $sum: '$calories' }
          }
        },
        {
          $group: {
            _id: '$_id.date',
            meals: {
              $push: {
                k: '$_id.mealType',
                v: '$totalCalories'
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            date: '$_id',
            meals: { $arrayToObject: '$meals' }
          }
        },
        { $sort: { date: 1 } }
      ]);
  
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de l’agrégation', error: error.message });
    }
  };

  exports.getWeeklyIngredientsByDay = async (req, res) => {
    try {
      const startOfWeek = moment().startOf('isoWeek').toDate();
      const endOfWeek = moment().endOf('isoWeek').toDate();
  
      const plans = await RecipePlan.find({
        date: { $gte: startOfWeek, $lte: endOfWeek }
      }).populate({
        path: 'recipeId',
        select: 'recipeIngredients',
        populate: {
          path: 'recipeIngredients.ingredientId',
          select: 'name defaultUnit'
        }
      });
  
      const dailyIngredientsMap = {};
  
      plans.forEach(plan => {
        const day = moment(plan.date).format('YYYY-MM-DD');
        const servings = plan.servings || 1;
        const ingredients = plan.recipeId?.recipeIngredients || [];

        if (!dailyIngredientsMap[day]) dailyIngredientsMap[day] = {};

        ingredients.forEach(ri => {
          if (!ri.ingredientId) return;
          const key = ri.ingredientId._id.toString();
          // Quantity per serving
          const quantityPerServing = ri.quantity / (plan.recipeId?.servings || 1);
          const quantity = quantityPerServing * servings;

          if (!dailyIngredientsMap[day][key]) {
            dailyIngredientsMap[day][key] = {
              name: ri.ingredientId.name,
              unit: ri.unit,
              quantity: 0
            };
          }

          dailyIngredientsMap[day][key].quantity += quantity;
        });
      });
  
      const result = Object.entries(dailyIngredientsMap).map(([date, ingredientsObj]) => ({
        date,
        ingredients: Object.values(ingredientsObj)
      }));
  
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur lors du calcul des ingrédients par jour' });
    }
  };

  // Get grocery list for a specific week
  // Logic:
  // - Ingredients from NON-batch meals planned in the period
  // - Ingredients from BATCH SESSIONS where preparedDate is in the period
  exports.getGroceryList = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const start = startDate
        ? moment(startDate).startOf('day').toDate()
        : moment().startOf('isoWeek').toDate();

      const end = endDate
        ? moment(endDate).endOf('day').toDate()
        : moment().endOf('isoWeek').toDate();

      const ingredientsMap = {};

      // Helper to add ingredients to the map
      const addIngredients = (recipe, multiplier = 1) => {
        if (!recipe) return;
        const recipeServings = recipe.servings || 1;
        const ingredients = recipe.recipeIngredients || [];

        ingredients.forEach(ri => {
          if (!ri.ingredientId) return;
          const key = ri.ingredientId._id.toString();
          const unit = ri.unit || ri.ingredientId.defaultUnit || 'g';

          // Total quantity for this recipe (all servings * multiplier)
          const quantity = ri.quantity * multiplier;

          if (!ingredientsMap[key]) {
            ingredientsMap[key] = {
              id: key,
              name: ri.ingredientId.name,
              defaultUnit: ri.ingredientId.defaultUnit || 'g',
              unitConversions: ri.ingredientId.unitConversions || {},
              quantities: {}
            };
          }

          if (!ingredientsMap[key].quantities[unit]) {
            ingredientsMap[key].quantities[unit] = 0;
          }
          ingredientsMap[key].quantities[unit] += quantity;
        });
      };

      // 1. Get NON-batch meals planned in the period
      const nonBatchPlans = await RecipePlan.find({
        userId: req.user._id,
        date: { $gte: start, $lte: end },
        isBatchCooked: { $ne: true } // Only non-batch meals
      }).populate({
        path: 'recipeId',
        select: 'recipeIngredients servings title',
        populate: {
          path: 'recipeIngredients.ingredientId',
          select: 'name defaultUnit unitConversions'
        }
      });

      nonBatchPlans.forEach(plan => {
        const servings = plan.servings || 1;
        const recipeServings = plan.recipeId?.servings || 1;
        const multiplier = servings / recipeServings;
        addIngredients(plan.recipeId, multiplier);
      });

      // 2. Get BATCH SESSIONS where preparedDate is in the period
      const batchSessions = await BatchSession.find({
        userId: req.user._id,
        preparedDate: { $gte: start, $lte: end }
      }).populate({
        path: 'recipeId',
        select: 'recipeIngredients servings title',
        populate: {
          path: 'recipeIngredients.ingredientId',
          select: 'name defaultUnit unitConversions'
        }
      });

      batchSessions.forEach(session => {
        // Multiplier = quantityMultiplier (how many times the recipe is made)
        addIngredients(session.recipeId, session.quantityMultiplier || 1);
      });

      // Convert to array and format quantities
      const groceryList = Object.values(ingredientsMap)
        .map(ing => {
          // Group quantities by unit type (weight, volume, count, other)
          const grouped = { weight: 0, volume: 0, count: 0, other: {} };

          Object.entries(ing.quantities).forEach(([unit, qty]) => {
            const normalizedUnit = unit.toLowerCase().trim();

            // Weight units -> convert to grams
            if (normalizedUnit === 'g' || normalizedUnit === 'gram' || normalizedUnit === 'grams' || normalizedUnit === 'gramme' || normalizedUnit === 'grammes') {
              grouped.weight += qty;
            } else if (normalizedUnit === 'kg' || normalizedUnit === 'kilogram' || normalizedUnit === 'kilograms' || normalizedUnit === 'kilogramme' || normalizedUnit === 'kilogrammes') {
              grouped.weight += qty * 1000; // kg to g
            }
            // Volume units -> convert to ml
            else if (normalizedUnit === 'ml' || normalizedUnit === 'milliliter' || normalizedUnit === 'millilitre') {
              grouped.volume += qty;
            } else if (normalizedUnit === 'l' || normalizedUnit === 'liter' || normalizedUnit === 'litre') {
              grouped.volume += qty * 1000; // L to ml
            } else if (normalizedUnit === 'cl' || normalizedUnit === 'centiliter' || normalizedUnit === 'centilitre') {
              grouped.volume += qty * 10; // cl to ml
            }
            // Count units (pieces, units, etc.)
            else if (['unit', 'units', 'piece', 'pieces', 'pièce', 'pièces', 'pc', 'pcs'].includes(normalizedUnit)) {
              grouped.count += qty;
            }
            // Other units - keep separate
            else {
              if (!grouped.other[unit]) grouped.other[unit] = 0;
              grouped.other[unit] += qty;
            }
          });

          // Build display parts
          const parts = [];

          // Weight: display in kg if >= 1000g, otherwise in g
          if (grouped.weight > 0) {
            if (grouped.weight >= 1000) {
              parts.push({ quantity: parseFloat((grouped.weight / 1000).toFixed(2)), unit: 'kg' });
            } else {
              parts.push({ quantity: parseFloat(grouped.weight.toFixed(2)), unit: 'g' });
            }
          }

          // Volume: display in L if >= 1000ml, otherwise in ml
          if (grouped.volume > 0) {
            if (grouped.volume >= 1000) {
              parts.push({ quantity: parseFloat((grouped.volume / 1000).toFixed(2)), unit: 'L' });
            } else {
              parts.push({ quantity: parseFloat(grouped.volume.toFixed(2)), unit: 'ml' });
            }
          }

          // Count
          if (grouped.count > 0) {
            parts.push({ quantity: Math.round(grouped.count), unit: grouped.count === 1 ? 'pc' : 'pcs' });
          }

          // Other units
          Object.entries(grouped.other).forEach(([unit, qty]) => {
            parts.push({ quantity: parseFloat(qty.toFixed(2)), unit });
          });

          // Format for display
          let displayQuantity, displayUnit;
          if (parts.length === 1) {
            displayQuantity = parts[0].quantity;
            displayUnit = parts[0].unit;
          } else if (parts.length > 1) {
            displayQuantity = parts.map(p => `${p.quantity} ${p.unit}`).join(' + ');
            displayUnit = '';
          } else {
            displayQuantity = 0;
            displayUnit = '';
          }

          return {
            id: ing.id,
            name: ing.name,
            quantity: displayQuantity,
            unit: displayUnit,
            rawQuantities: ing.quantities
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name));

      res.json({
        startDate: start,
        endDate: end,
        nonBatchMeals: nonBatchPlans.length,
        batchSessions: batchSessions.length,
        ingredients: groceryList
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error calculating grocery list' });
    }
  };

