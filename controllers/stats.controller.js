const RecipePlan = require("../models/recipePlan.model");


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
              $divide: [
                { $multiply: ['$recipe.nutrition.caloriesPer100g', '$servings'] },
                1 // <- adapter si portion différente
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

      console.log({stats})
  
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de l’agrégation', error: error.message });
    }
  };
  