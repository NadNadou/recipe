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
                id: 'dash_plan',
                name: 'Planification',
                icon: <Icons.CalendarTime />,
                path: '/apps/calendar',
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
    },

    {
        group: 'Pages',
        contents: [
            {
                id: "dash_pages",
                name: 'Authentication',
                icon: <Icons.UserPlus />,
                path: '/auth',
                childrens: [
                    {
                        id: "dash_log",
                        name: 'Log In',
                        path: '/auth',
                        childrens: [
                            {
                                name: 'Login',
                                path: '/auth/login',
                            },
                        ]
                    },
                    {
                        id: "dash_sign",
                        name: 'Sign Up',
                        path: '/auth',
                        childrens: [
                            {
                                name: 'Signup',
                                path: '/auth/signup',
                            },
                            {
                                name: 'Signup Simple',
                                path: '/auth/signup-simple',
                            },
                            {
                                name: 'Signup Classic',
                                path: '/auth/signup',
                            },
                        ]
                    },
                ]
            },
            {
                id: "dash_profile",
                name: 'Profile',
                icon: <Icons.UserSearch />,
                path: '/pages',
                badgeIndicator: <HkBadge bg="danger" indicator className="position-absolute top-0 start-100" />,
                childrens: [
                    {
                        name: 'Profile',
                        path: '/pages/profile',
                        grp_name: "apps",
                    },
                    {
                        name: 'Edit Profile',
                        path: '/pages/edit-profile',
                        grp_name: "apps",
                    },
                    {
                        name: 'Account',
                        path: '/pages/account',
                        grp_name: "apps",
                    },
                ]
            },

        ]
    },

    {
        group: 'Documentation',
        contents: [
            {
                name: 'Documentation',
                icon: <Icons.FileCode2 />,
                path: 'https://nubra-ui-react.netlify.app/introduction',
            },
            {
                name: 'Components',
                icon: <Icons.Layout />,
                path: 'https://nubra-ui-react.netlify.app/avatar',
            },
        ]
    },
]