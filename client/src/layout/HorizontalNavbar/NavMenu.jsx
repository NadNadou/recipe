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
                id: 'dash_chatpop',
                name: 'Calendar',
                icon: <Icons.CalendarTime />,
                path: '/apps/calendar',
                grp_name: "apps",
            },
            {
                id: "dash_contact",
                name: 'Contact',
                icon: <Icons.Notebook />,
                path: '/apps/contacts',
                childrens: [
                    {
                        name: 'Contact List',
                        path: '/apps/contacts/contact-list',
                        grp_name: "apps",
                    },
                    {
                        name: 'Contact Cards',
                        path: '/apps/contacts/contact-cards',
                        grp_name: "apps",
                    },
                    {
                        name: 'Edit Contact',
                        path: '/apps/contacts/edit-contact',
                        grp_name: "apps",
                    },
                ]
            },
            {
                id: "dash_file",
                name: 'File Manager',
                icon: <Icons.FileCheck />,
                path: '/apps/file-manager',
                childrens: [
                    {
                        name: 'List View',
                        path: '/apps/file-manager/list-view',
                        grp_name: "apps",
                    },
                    {
                        name: 'Grid View',
                        path: '/apps/file-manager/grid-view',
                        grp_name: "apps",
                    },
                ]
            },
            {
                name: 'Gallery',
                icon: <Icons.Photo />,
                path: '/apps/gallery',
                grp_name: "apps",
            },
            {
                id: "dash_task",
                name: 'Todo',
                icon: <Icons.ListDetails />,
                path: '/apps/todo',
                badge: <HkBadge bg="success" soft className="ms-2">2</HkBadge>,
                childrens: [
                    {
                        name: 'Tasklist',
                        path: '/apps/todo/task-list',
                        grp_name: "apps",
                    },
                    {
                        name: 'Gantt',
                        path: '/apps/todo/gantt',
                        grp_name: "apps",
                    },
                ]
            },
            {
                id: "dash_blog",
                name: 'Blog',
                icon: <Icons.Browser />,
                path: '/apps/blog',
                childrens: [
                    {
                        name: 'Posts',
                        path: '/apps/blog/posts',
                        grp_name: "apps",
                    },
                    {
                        name: 'Add New Post',
                        path: '/apps/blog/add-new-post',
                        grp_name: "apps",
                    },
                    {
                        name: 'Post Detail',
                        path: '/apps/blog/post-detail',
                        grp_name: "apps",
                    },
                ]
            },
            {
                id: "dash_invoice",
                name: 'Invoices',
                icon: <Icons.FileDigit />,
                path: '/apps/invoices',
                childrens: [
                    {
                        name: 'Invoice List',
                        path: '/apps/invoices/invoice-list',
                        grp_name: "apps",
                    },
                    {
                        name: 'Invoice Templates',
                        path: '/apps/invoices/invoice-templates',
                        grp_name: "apps",
                    },
                    {
                        name: 'Create Invoice',
                        path: '/apps/invoices/create-invoice',
                        grp_name: "apps",
                    },
                    {
                        name: 'Invoice Preview',
                        path: '/apps/invoices/invoice-preview',
                        grp_name: "apps",
                    },
                ]
            },
            {
                id: "dash_integ",
                name: 'Integrations',
                icon: <Icons.Code />,
                path: '/apps/integrations',
                childrens: [
                    {
                        name: 'All Apps',
                        path: '/apps/integrations/all-apps',
                        grp_name: "apps",
                    },
                    {
                        name: 'App Detail',
                        path: '/apps/integrations/integrations-detail',
                        grp_name: "apps",
                    },
                    {
                        name: 'Integrations',
                        path: '/apps/integrations/integration',
                        grp_name: "apps",
                    },
                ]
            },
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
                                path: '/auth/login-classic',
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
                                path: '/auth/signup-classic',
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