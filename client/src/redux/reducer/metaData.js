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
        label: 'Petit-déjeuner',
        backgroundColor: '#FFD700',
        borderColor: '#FFC107',
        defaultTime: '08:00',
      },
      {
        value: 'lunch',
        label: 'Déjeuner',
        backgroundColor: '#4CAF50',
        borderColor: '#43A047',
        defaultTime: '12:00',
      },
      {
        value: 'snack',
        label: 'Snack',
        backgroundColor: '#FF5722',
        borderColor: '#F4511E',
        defaultTime: '16:00',
      },
      {
        value: 'dinner',
        label: 'Dîner',
        backgroundColor: '#2196F3',
        borderColor: '#1E88E5',
        defaultTime: '20:00',
      },
      {
        value: 'baby',
        label: 'Babyfood',
        backgroundColor: '#FFEFD5',
        borderColor: '#F4A460',        
        defaultTime: '13:00',
      },
    ],    
    cookingUnits: [
      { label: 'g', type: 'solide' },
      { label: 'kg', type: 'solide' },
      { label: 'ml', type: 'liquide' },
      { label: 'cl', type: 'liquide' },
      { label: 'l', type: 'liquide' },
      { label: 'c. à café', type: 'liquide' },
      { label: 'c. à soupe', type: 'liquide' },
      { label: 'pincée', type: 'solide' },
      { label: 'sachet', type: 'solide' },
      { label: 'gousse', type: 'solide' },
      { label: 'tranche', type: 'solide' },
      { label: 'pièce', type: 'solide' },
      { label: 'boîte', type: 'solide' },
      { label: 'verre', type: 'liquide' },
      { label: 'tasse', type: 'liquide' },
      { label: 'cuillère', type: 'liquide' },
      { label: 'poignée', type: 'solide' }
    ],
    nutritionalProperties: [
      { label: 'Riche en protéines', category: 'macronutriment' },
      { label: 'Source de fibres', category: 'macronutriment' },
      { label: 'Faible en calories', category: 'énergie' },
      { label: 'Faible en glucides', category: 'macronutriment' },
      { label: 'Riche en bons lipides', category: 'macronutriment' },
      { label: 'Riche en minéraux', category: 'micronutriment' },
      { label: 'Riche en vitamines', category: 'micronutriment' },
      { label: 'Index glycémique bas', category: 'indice glycémique' },
      { label: 'Antioxydant', category: 'fonctionnel' },
      { label: 'Source de fer', category: 'micronutriment' },
      { label: 'Source de calcium', category: 'micronutriment' },
      { label: 'Source de magnésium', category: 'micronutriment' }
    ],
    functionalBenefits : [
      { label: 'Anti-ballonnement', type: 'digestif' },
      { label: 'Facilite la digestion', type: 'digestif' },
      { label: 'Bon pour la concentration', type: 'cognitif' },
      { label: 'Favorise la santé cardiovasculaire', type: 'cardio' },
      { label: 'Réduit le stress / anxiété', type: 'nerveux' },
      { label: 'Favorise le sommeil', type: 'nerveux' },
      { label: 'Anti-inflammatoire', type: 'inflammatoire' },
      { label: 'Effet coupe-faim', type: 'métabolique' },
      { label: 'Régule le transit intestinal', type: 'digestif' },
      { label: 'Favorise l’équilibre hormonal', type: 'hormonal' },
      { label: 'Effet détox', type: 'détoxifiant' }
    ],
    dietaryProperties :[
      { label: 'Végétarien', category: 'régime' },
      { label: 'Sans gluten', category: 'intolérance' },
      { label: 'Express', category: 'temps de préparation' },
      { label: 'Végan', category: 'régime' },
      { label: 'Sans lactose', category: 'intolérance' },
      { label: 'Pauvre en FODMAP', category: 'intolérance' },
      { label: 'Riche en fibres', category: 'fonctionnel' },
      { label: 'Keto', category: 'régime' },
      { label: 'Paleo', category: 'régime' },
      { label: 'Low carb', category: 'régime' },
      { label: 'Repas de fête', category: 'occasion' },
      { label: 'Batch cooking', category: 'organisation' },
      { label: 'Babyfood', category: 'famille' }
    ]
    
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
  