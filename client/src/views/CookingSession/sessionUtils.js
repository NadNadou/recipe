/**
 * Calculate cooking session timeline with parallelization.
 *
 * Rules:
 * - Each appliance is a separate "track".
 * - Recipes on the SAME appliance run sequentially.
 * - Recipes on DIFFERENT appliances run in parallel.
 * - A recipe with multiple appliances blocks ALL of them simultaneously.
 * - Total time = max of all track durations (parallel execution).
 */
export const calculateSessionTimeline = (selectedRecipes, cookingAppliances) => {
  if (!selectedRecipes || selectedRecipes.length === 0) {
    return {
      totalTime: 0,
      sequentialTime: 0,
      parallelSavings: 0,
      appliancesUsed: 0,
      byAppliance: {},
      tracks: [],
    };
  }

  // 1. Group recipes by appliance
  const byAppliance = {};
  cookingAppliances.forEach(app => {
    byAppliance[app.value] = [];
  });

  selectedRecipes.forEach(recipe => {
    const appliances = recipe.cookingAppliances?.length > 0
      ? recipe.cookingAppliances
      : ['no-heat'];
    appliances.forEach(app => {
      if (!byAppliance[app]) byAppliance[app] = [];
      byAppliance[app].push(recipe);
    });
  });

  // 2. Build tracks with time slots
  // For multi-appliance recipes, we need to schedule them so they
  // occupy all their appliances at the same time.
  const trackEndTimes = {}; // current end time for each appliance track
  cookingAppliances.forEach(app => {
    trackEndTimes[app.value] = 0;
  });

  const tracks = []; // { recipeId, recipeName, appliance, start, duration }

  // Process recipes in order. For multi-appliance recipes, find the
  // earliest time when ALL required appliances are free.
  selectedRecipes.forEach(recipe => {
    const appliances = recipe.cookingAppliances?.length > 0
      ? recipe.cookingAppliances
      : ['no-heat'];
    const cookTime = recipe.cookTime || 0;
    const prepTime = recipe.prepTime || 0;
    const totalRecipeTime = prepTime + cookTime;

    if (totalRecipeTime === 0) return;

    // Find the earliest start = max of all required appliance end times
    const earliestStart = Math.max(...appliances.map(app => trackEndTimes[app] || 0));

    // Schedule on all required appliances
    appliances.forEach(app => {
      tracks.push({
        recipeId: recipe._id,
        recipeName: recipe.title,
        appliance: app,
        start: earliestStart,
        duration: totalRecipeTime,
      });
      trackEndTimes[app] = earliestStart + totalRecipeTime;
    });
  });

  // 3. Compute stats
  const totalTime = Math.max(...Object.values(trackEndTimes), 0);
  const sequentialTime = selectedRecipes.reduce(
    (sum, r) => sum + (r.prepTime || 0) + (r.cookTime || 0),
    0
  );
  const parallelSavings = Math.max(sequentialTime - totalTime, 0);
  const appliancesUsed = Object.entries(byAppliance)
    .filter(([, recipes]) => recipes.length > 0).length;

  return {
    totalTime,
    sequentialTime,
    parallelSavings,
    appliancesUsed,
    byAppliance,
    tracks,
  };
};
