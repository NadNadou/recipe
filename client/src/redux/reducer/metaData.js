import {
    // Ingredients
    GET_INGREDIENTS_REQUEST,
    GET_INGREDIENTS_SUCCESS,
    GET_INGREDIENTS_FAIL,
    CREATE_INGREDIENT_REQUEST,
    CREATE_INGREDIENT_SUCCESS,
    CREATE_INGREDIENT_FAIL,
    UPDATE_INGREDIENT_REQUEST,
    UPDATE_INGREDIENT_SUCCESS,
    UPDATE_INGREDIENT_FAIL,
    DELETE_INGREDIENT_REQUEST,
    DELETE_INGREDIENT_SUCCESS,
    DELETE_INGREDIENT_FAIL,
    GET_INGREDIENT_DETAIL_SUCCESS,
  
    // Tags
    GET_TAGS_REQUEST,
    GET_TAGS_SUCCESS,
    GET_TAGS_FAIL,
    CREATE_TAG_REQUEST,
    CREATE_TAG_SUCCESS,
    CREATE_TAG_FAIL,
    UPDATE_TAG_REQUEST,
    UPDATE_TAG_SUCCESS,
    UPDATE_TAG_FAIL,
    DELETE_TAG_REQUEST,
    DELETE_TAG_SUCCESS,
    DELETE_TAG_FAIL,
  
    // Equipments
    GET_EQUIPMENTS_REQUEST,
    GET_EQUIPMENTS_SUCCESS,
    GET_EQUIPMENTS_FAIL,
    CREATE_EQUIPMENT_REQUEST,
    CREATE_EQUIPMENT_SUCCESS,
    CREATE_EQUIPMENT_FAIL,
    UPDATE_EQUIPMENT_REQUEST,
    UPDATE_EQUIPMENT_SUCCESS,
    UPDATE_EQUIPMENT_FAIL,
    DELETE_EQUIPMENT_REQUEST,
    DELETE_EQUIPMENT_SUCCESS,
    DELETE_EQUIPMENT_FAIL,
  } from '../constants/MetaData';
  
  const initialState = {
    ingredients: [],
    ingredientDetail:null,
    tags: [],
    equipments: [],
    loading: false,
    error: null,
    mealTypes: [
      {
        value: 'breakfast',
        label: 'Breakfast',
        short: 'BRK',
        backgroundColor: '#FFA726',
        borderColor: '#FB8C00',
        defaultTime: '08:00',
      },
      {
        value: 'lunch',
        label: 'Lunch',
        short: 'LUN',
        backgroundColor: '#66BB6A',
        borderColor: '#43A047',
        defaultTime: '12:00',
      },
      {
        value: 'dinner',
        label: 'Dinner',
        short: 'DIN',
        backgroundColor: '#42A5F5',
        borderColor: '#1E88E5',
        defaultTime: '19:30',
      },
      {
        value: 'lunchbox',
        label: 'Lunchbox',
        short: 'LBX',
        backgroundColor: '#AB47BC',
        borderColor: '#8E24AA',
        defaultTime: '12:00',
      },
      {
        value: 'babyfood',
        label: 'Babyfood',
        short: 'BBF',
        backgroundColor: '#EC407A',
        borderColor: '#D81B60',
        defaultTime: '12:00',
      },
    ],    
    cookingUnits: [
      { label: 'g', type: 'solid' },
      { label: 'kg', type: 'solid' },
      { label: 'ml', type: 'liquid' },
      { label: 'cl', type: 'liquid' },
      { label: 'l', type: 'liquid' },
      { label: 'tsp', type: 'liquid' }, // teaspoon
      { label: 'tbsp', type: 'liquid' }, // tablespoon
      { label: 'pinch', type: 'solid' },
      { label: 'packet', type: 'solid' },
      { label: 'clove', type: 'solid' },
      { label: 'slice', type: 'solid' },
      { label: 'piece', type: 'solid' },
      { label: 'can', type: 'solid' },
      { label: 'glass', type: 'liquid' },
      { label: 'cup', type: 'liquid' },
      { label: 'spoonful', type: 'liquid' },
      { label: 'handful', type: 'solid' }
    ],    
    nutritionalProperties: [
      { label: 'High in protein', category: 'macronutrient' },
      { label: 'Source of fiber', category: 'macronutrient' },
      { label: 'Low in calories', category: 'energy' },
      { label: 'Low in carbs', category: 'macronutrient' },
      { label: 'Rich in healthy fats', category: 'macronutrient' },
      { label: 'Rich in minerals', category: 'micronutrient' },
      { label: 'Rich in vitamins', category: 'micronutrient' },
      { label: 'Low glycemic index', category: 'glycemic index' },
      { label: 'Antioxidant', category: 'functional' },
      { label: 'Source of iron', category: 'micronutrient' },
      { label: 'Source of calcium', category: 'micronutrient' },
      { label: 'Source of magnesium', category: 'micronutrient' }
    ],    
    functionalBenefits: [
      { label: 'Anti-bloating', type: 'digestive' },
      { label: 'Aids digestion', type: 'digestive' },
      { label: 'Boosts focus', type: 'cognitive' },
      { label: 'Supports heart health', type: 'cardiovascular' },
      { label: 'Reduces stress / anxiety', type: 'nervous' },
      { label: 'Improves sleep', type: 'nervous' },
      { label: 'Anti-inflammatory', type: 'inflammatory' },
      { label: 'Appetite suppressant', type: 'metabolic' },
      { label: 'Regulates digestion', type: 'digestive' },
      { label: 'Supports hormonal balance', type: 'hormonal' },
      { label: 'Detox effect', type: 'detoxifying' }
    ],    
    dietaryProperties: [
      { label: 'Vegetarian', category: 'diet' },
      { label: 'Gluten-free', category: 'intolerance' },
      { label: 'Quick to prepare', category: 'preparation time' },
      { label: 'Vegan', category: 'diet' },
      { label: 'Lactose-free', category: 'intolerance' },
      { label: 'Low FODMAP', category: 'intolerance' },
      { label: 'High in fiber', category: 'functional' },
      { label: 'Keto', category: 'diet' },
      { label: 'Paleo', category: 'diet' },
      { label: 'Low carb', category: 'diet' },
      { label: 'Holiday meal', category: 'occasion' },
      { label: 'Batch cooking', category: 'organization' },
      { label: 'Babyfood', category: 'family' }
    ],
    cookingAppliances: [
      { value: 'oven', label: 'Oven', icon: '🔥', color: '#FF6B6B' },
      { value: 'stovetop', label: 'Stovetop', icon: '🍳', color: '#4ECDC4' },
      { value: 'airfryer', label: 'Air Fryer', icon: '💨', color: '#45B7D1' },
      { value: 'steamer', label: 'Steamer', icon: '♨️', color: '#A8E6CF' },
      { value: 'no-heat', label: 'No Cooking', icon: '🥗', color: '#96CEB4' },
      { value: 'robot', label: 'Blender/Processor', icon: '🔪', color: '#FFB347' },
    ],
    ingredientCategories: [
      { value: 'fruits-vegetables', label: 'Fruits & Vegetables', icon: '🥕', color: '#66BB6A' },
      { value: 'meat-poultry', label: 'Meat & Poultry', icon: '🥩', color: '#EF5350' },
      { value: 'fish-seafood', label: 'Fish & Seafood', icon: '🐟', color: '#42A5F5' },
      { value: 'dairy-eggs', label: 'Dairy & Eggs', icon: '🥚', color: '#FFA726' },
      { value: 'grains-starches', label: 'Grains & Starches', icon: '🌾', color: '#D4A574' },
      { value: 'legumes', label: 'Legumes', icon: '🫘', color: '#8D6E63' },
      { value: 'herbs-spices', label: 'Herbs & Spices', icon: '🌿', color: '#26A69A' },
      { value: 'oils-fats', label: 'Oils & Fats', icon: '🫒', color: '#FFCA28' },
      { value: 'condiments-sauces', label: 'Condiments & Sauces', icon: '🧂', color: '#AB47BC' },
      { value: 'nuts-seeds', label: 'Nuts & Seeds', icon: '🥜', color: '#A1887F' },
      { value: 'beverages', label: 'Beverages', icon: '🥤', color: '#29B6F6' },
      { value: 'other', label: 'Other', icon: '📦', color: '#78909C' },
    ],
  };
  
  const metaDataReducer = (state = initialState, action) => {
    switch (action.type) {
      // INGREDIENTS
      case GET_INGREDIENTS_REQUEST:
      case CREATE_INGREDIENT_REQUEST:
      case UPDATE_INGREDIENT_REQUEST:
      case DELETE_INGREDIENT_REQUEST:
        return { ...state, loading: true, error: null };

      case GET_INGREDIENT_DETAIL_SUCCESS:
        return {
          ...state,
          loading: false,
          ingredientDetail: action.payload,
        };
  
      case GET_INGREDIENTS_SUCCESS:
        return { ...state, loading: false, ingredients: action.payload };
  
      case CREATE_INGREDIENT_SUCCESS:
        return { ...state, loading: false, ingredients: [...state.ingredients, action.payload] };
  
      case UPDATE_INGREDIENT_SUCCESS:
        return {
          ...state,
          loading: false,
          ingredients: state.ingredients.map(ing =>
            ing._id === action.payload._id ? action.payload : ing
          ),
        };
  
      case DELETE_INGREDIENT_SUCCESS:
        return {
          ...state,
          loading: false,
          ingredients: state.ingredients.filter(ing => ing._id !== action.payload),
        };
  
      case GET_INGREDIENTS_FAIL:
      case CREATE_INGREDIENT_FAIL:
      case UPDATE_INGREDIENT_FAIL:
      case DELETE_INGREDIENT_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      // TAGS
      case GET_TAGS_REQUEST:
      case CREATE_TAG_REQUEST:
      case UPDATE_TAG_REQUEST:
      case DELETE_TAG_REQUEST:
        return { ...state, loading: true, error: null };
  
      case GET_TAGS_SUCCESS:
        return { ...state, loading: false, tags: action.payload };
  
      case CREATE_TAG_SUCCESS:
        return { ...state, loading: false, tags: [...state.tags, action.payload] };
  
      case UPDATE_TAG_SUCCESS:
        return {
          ...state,
          loading: false,
          tags: state.tags.map(tag =>
            tag._id === action.payload._id ? action.payload : tag
          ),
        };
  
      case DELETE_TAG_SUCCESS:
        return {
          ...state,
          loading: false,
          tags: state.tags.filter(tag => tag._id !== action.payload),
        };
  
      case GET_TAGS_FAIL:
      case CREATE_TAG_FAIL:
      case UPDATE_TAG_FAIL:
      case DELETE_TAG_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      // EQUIPMENTS
      case GET_EQUIPMENTS_REQUEST:
      case CREATE_EQUIPMENT_REQUEST:
      case UPDATE_EQUIPMENT_REQUEST:
      case DELETE_EQUIPMENT_REQUEST:
        return { ...state, loading: true, error: null };
  
      case GET_EQUIPMENTS_SUCCESS:
        return { ...state, loading: false, equipments: action.payload };
  
      case CREATE_EQUIPMENT_SUCCESS:
        return { ...state, loading: false, equipments: [...state.equipments, action.payload] };
  
      case UPDATE_EQUIPMENT_SUCCESS:
        return {
          ...state,
          loading: false,
          equipments: state.equipments.map(eq =>
            eq._id === action.payload._id ? action.payload : eq
          ),
        };
  
      case DELETE_EQUIPMENT_SUCCESS:
        return {
          ...state,
          loading: false,
          equipments: state.equipments.filter(eq => eq._id !== action.payload),
        };
  
      case GET_EQUIPMENTS_FAIL:
      case CREATE_EQUIPMENT_FAIL:
      case UPDATE_EQUIPMENT_FAIL:
      case DELETE_EQUIPMENT_FAIL:
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  };
  
  export default metaDataReducer;
  