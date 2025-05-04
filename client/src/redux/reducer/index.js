
import { combineReducers } from 'redux';
import ChatReducer from './Chat';
import ChatPopupReducer from './ChatPopup';
import EmailReducer from './Email';
import Theme from './Theme';
import ToDoReducer from './ToDo';
import UserReducer from './User';
import RecipeReducer from './Recipe';
import MetaDataReducer from "./metaData"
import PlanReducer from "./Plans";

const reducers = combineReducers({
    theme: Theme,
    chatReducer: ChatReducer,
    emailReducer: EmailReducer,
    chatPopupReducer: ChatPopupReducer,
    toDoReducer: ToDoReducer,
    recipeReducer: RecipeReducer,
    metadataReducer: MetaDataReducer,
    planReducer:PlanReducer,
    user: UserReducer
});

export default reducers;