import * as Icons from 'tabler-icons-react';
import HkBadge from '../../components/@hk-badge/@hk-badge';

export const NavMenu = [
    {
        group: '',
        contents: [
            {
                name: 'Dashboard',
                icon: <Icons.Template />,
                path: '/dashboard',
                // badge: <HkBadge size="sm" bg="pink" soft className="ms-xl-2 ms-auto" >hot</HkBadge>
            },
        ]
    },
    {
        group: 'Apps',
        contents: [
            {
                id: 'dash_meal_planner',
                name: 'Week Planner',
                icon: <Icons.Calendar />,
                path: '/apps/meal-planner',
                grp_name: "apps",
            },
            {
                id: 'dash_cooking_session',
                name: 'Cooking Session',
                icon: <Icons.Flame />,
                path: '/apps/cooking-session',
                grp_name: "apps",
            },
            {
                id: 'dash_ingredients',
                name: 'All ingredients',
                icon: <Icons.Carrot />,
                path: '/apps/ingredient/all',
                grp_name: "apps",
            },
            {
                id: 'dash_recipes',
                name: 'All recipes',
                icon: <Icons.ChefHat />,
                path: '/apps/recipe/all',
                grp_name: "apps",
            }
        ]
    }
]