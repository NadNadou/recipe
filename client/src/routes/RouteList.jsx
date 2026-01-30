import Calendar from "../views/Calendar";

import Dashboard from "../views/Dashboard";
import Email from "../views/Email";

//Pages
import Profile from "../views/Profiles/Profile";
import EditProfile from "../views/Profiles/EditProfile";
import Account from "../views/Profiles/Account";
//Auth

import Login from "../views/Authentication/LogIn";
import Signup from "../views/Authentication/SignUp";
import LockScreen from "../views/Authentication/LockScreen";
import ResetPassword from "../views/Authentication/ResetPassword";
import Error404 from "../views/Authentication/Error404/Error404";
import Error503 from "../views/Authentication/Error503/Error503";

import RecipeCards from "../views/Recipe/RecipeCards";
import RecipeDetail from "../views/Recipe/RecipeDetails";
import IngredientCards from "../views/Ingredients/IngredientCards";


export const routes = [

    { path: 'dashboard', exact: true, component: Dashboard,protected:true},
    //Apps

    { path: 'apps/recipe/all', exact: true, component: RecipeCards, protected:true},
    { path: 'apps/ingredient/all', exact: true, component: IngredientCards, protected:true },
    { path: 'apps/recipe/detail/:id', exact: true, component: RecipeDetail, protected:true},
    { path: 'apps/calendar', exact: true, component: Calendar, protected:true},

    { path: 'apps/email', exact: true, component: Email },
    //Pages
    { path: 'pages/profile', exact: true, component: Profile },
    { path: 'pages/edit-profile', exact: true, component: EditProfile },
    { path: 'pages/account', exact: true, component: Account },
    //Error
    { path: 'error-404', exact: true, component: Error404 },
]

export const authRoutes = [
    { path: '/login', exact: true, component: Login },
    { path: '/signup', exact: true, component: Signup },
    { path: '/lock-screen', exact: true, component: LockScreen },
    { path: '/reset-password', exact: true, component: ResetPassword },
    { path: '/error-503', exact: true, component: Error503 },
]