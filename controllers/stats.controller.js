const moment = require('moment');
const RecipePlan = require('../models/recipePlan.model');


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
                '$recipe.nutrition.calories',  // total calories for the recipe
                '$recipe.servings'             // -> portion individuelle
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
        const ingredients = plan.recipeId.recipeIngredients;
  
        if (!dailyIngredientsMap[day]) dailyIngredientsMap[day] = {};
  
        ingredients.forEach(ri => {
          const key = ri.ingredientId._id.toString();
          const quantity = ri.quantity * servings;
  
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
  