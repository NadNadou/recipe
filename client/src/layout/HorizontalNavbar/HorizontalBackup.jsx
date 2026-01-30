import React, { useEffect, useState } from 'react';
import { Container, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import { horizontalMenu } from '../../utils/HorizontalNavInit';
import NavHeader from './NavHeader';
import { useHistory } from 'react-router-dom';
import { NavMenu } from './NavMenu';
import classNames from 'classnames';
import { FileText } from 'react-feather';

const HorizontalNav = () => {

    const [activeMenu, setActiveMenu] = useState();

    let history = useHistory();

    useEffect(() => {
        setTimeout(() => {
            horizontalMenu();
        }, 500);

        document.addEventListener("click", function (e) {
            const target = e.target.closest(".more-nav-item");
            if (target) {
                e.preventDefault();
                const newTarget = e.target.closest(".nav-link");
                history.push(newTarget.getAttribute("href"));
            }
        });

    }, [history])

    const handleClick = (menuName) => {
        setActiveMenu(menuName);
    }


    return (
        <>
            <div className="hk-menu">
                {/* Brand */}
                <NavHeader />
                {/* /Brand */}
                {/* Main Menu */}
                <SimpleBar className="nicescroll-bar">
                    <div className="menu-content-wrap">
                        <Container fluid className="menu-group">
                            <Nav as="ul" className="navbar-nav flex-column">

                                <Nav.Item as='li'>
                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/dashboard" >
                                        <span className="nav-icon-wrap">
                                            <span className="svg-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-template" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <rect x={4} y={4} width={16} height={4} rx={1} />
                                                    <rect x={4} y={12} width={6} height={8} rx={1} />
                                                    <line x1={14} y1={12} x2={20} y2={12} />
                                                    <line x1={14} y1={16} x2={20} y2={16} />
                                                    <line x1={14} y1={20} x2={20} y2={20} />
                                                </svg>
                                            </span>
                                        </span>
                                        <span className="nav-link-text">Dashboard</span>
                                        <span className="badge badge-sm badge-soft-pink ms-xl-2 ms-auto">Hot</span>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item as='li'>
                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/apps/chat" data-bs-toggle="collapse" data-bs-target="#dash_chat">
                                        <span className="nav-icon-wrap">
                                            <span className="svg-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-message-dots" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4" />
                                                    <line x1={12} y1={11} x2={12} y2="11.01" />
                                                    <line x1={8} y1={11} x2={8} y2="11.01" />
                                                    <line x1={16} y1={11} x2={16} y2="11.01" />
                                                </svg>
                                            </span>
                                        </span>
                                        <span className="nav-link-text">Chat</span>
                                    </Nav.Link>
                                    <ul id="dash_chat" className="nav flex-column collapse   nav-children">
                                        <Nav.Item as='li'>
                                            <Nav as="ul" className="nav flex-column">
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} to="/horizontal/apps/chat/chats">
                                                        <span className="nav-link-text">Chats</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} to="/horizontal/apps/chat/chat-groups"><span className="nav-link-text">Groups</span></Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} to="/horizontal/apps/chat/chat-contact"><span className="nav-link-text">Contacts</span></Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} to="/horizontal/apps/chat-bot" data-bs-toggle="collapse" data-bs-target="#dash_wizard">
                                                        <span className="nav-link-text">Chat Popup</span>
                                                    </Nav.Link>
                                                    <ul id="dash_wizard" className="nav flex-column collapse   nav-children">
                                                        <Nav.Item as="li">
                                                            <ul className="nav flex-column">
                                                                <Nav.Item as="li">
                                                                    <Nav.Link as={NavLink} to="/horizontal/apps/chat-bot/chatpopup">
                                                                        <span className="nav-link-text">Direct Message</span>
                                                                    </Nav.Link>
                                                                </Nav.Item>
                                                                <Nav.Item as="li">
                                                                    <Nav.Link as={NavLink} to="/horizontal/apps/chat-bot/chatbot">
                                                                        <span className="nav-link-text">Chatbot</span>
                                                                    </Nav.Link>
                                                                </Nav.Item>
                                                            </ul>
                                                        </Nav.Item>
                                                    </ul>
                                                </Nav.Item>
                                            </Nav>
                                        </Nav.Item>
                                    </ul>
                                </Nav.Item>
                                <Nav.Item as='li'>
                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/apps/email">
                                        <span className="nav-icon-wrap">
                                            <span className="svg-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-inbox" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <rect x={4} y={4} width={16} height={16} rx={2} />
                                                    <path d="M4 13h3l3 3h4l3 -3h3" />
                                                </svg>
                                            </span>
                                        </span>
                                        <span className="nav-link-text">Email</span>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item as="li">
                            
                                    <Nav as="ul" id="dash_scrumboard" className="flex-column collapse   nav-children">
                                        <Nav.Item as="li">
                                            <Nav as="ul" className="flex-column">
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/apps/taskboard/projects-board">
                                                        <span className="nav-link-text">
                                                            All Boards
                                                        </span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/apps/taskboard/kanban-board">
                                                        <span className="nav-link-text">
                                                            Project Kanban
                                                        </span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/apps/taskboard/pipeline">
                                                        <span className="nav-link-text">
                                                            Pipeline Kanban
                                                        </span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                        </Nav.Item>
                                    </Nav>
                                </Nav.Item>
                                <Nav.Item as="li">
                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/apps/contacts" data-bs-toggle="collapse" data-bs-target="#dash_contact">
                                        <span className="nav-icon-wrap">
                                            <span className="svg-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-notebook" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18" />
                                                    <line x1={13} y1={8} x2={15} y2={8} />
                                                    <line x1={13} y1={12} x2={15} y2={12} />
                                                </svg>
                                            </span>
                                        </span>
                                        <span className="nav-link-text">Contact</span>
                                    </Nav.Link>
                                    <Nav as="ul" id="dash_contact" className="flex-column collapse   nav-children">
                                        <Nav.Item as="li">
                                            <Nav as="ul" className="nav flex-column">
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/apps/contacts/contact-cards">
                                                        <span className="nav-link-text">Contact Cards</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/apps/contacts/edit-contact">
                                                        <span className="nav-link-text">Edit Contact</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                        </Nav.Item>
                                    </Nav>
                                </Nav.Item>
                                <Nav.Item as="li">
                                    <Nav as="ul" id="dash_task" className="flex-column collapse   nav-children">
                                        <Nav.Item as="li">
                                            <Nav as="ul" className="flex-column">
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/apps/todo/task-list"><span className="nav-link-text">Tasklist</span></Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/apps/todo/gantt"><span className="nav-link-text">Gantt</span></Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                        </Nav.Item>
                                    </Nav>
                                </Nav.Item>
                                <Nav.Item as="li">
                                    <Nav as="ul" id="dash_invoice" className="nav flex-column collapse   nav-children">
                                        <Nav.Item as="li">
                                            <ul className="nav flex-column">
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/apps/invoices/invoice-list">
                                                        <span className="nav-link-text">Invoice List</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/apps/invoices/invoice-templates">
                                                        <span className="nav-link-text">Invoice Templates</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/apps/invoices/create-invoice">
                                                        <span className="nav-link-text">Create Invoice</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/apps/invoices/invoice-preview">
                                                        <span className="nav-link-text">Invoice Preview</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                            </ul>
                                        </Nav.Item>
                                    </Nav>
                                </Nav.Item>
                                <Nav.Item as="li">
                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/apps/calendar">
                                        <span className="nav-icon-wrap">
                                            <span className="svg-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-calendar-time" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M11.795 21h-6.795a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4" />
                                                    <circle cx={18} cy={18} r={4} />
                                                    <path d="M15 3v4" />
                                                    <path d="M7 3v4" />
                                                    <path d="M3 11h16" />
                                                    <path d="M18 16.496v1.504l1 1" />
                                                </svg>
                                            </span>
                                        </span>
                                        <span className="nav-link-text">Planification</span>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item as="li">
                                    <Nav as="ul" id="dash_blog" className="flex-column collapse  nav-children">
                                        <Nav.Item as="li">
                                            <Nav as="ul" className="flex-column">
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/apps/blog/posts" >
                                                        <span className="nav-link-text">Posts</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/apps/blog/add-new-post">
                                                        <span className="nav-link-text">Edit Posts</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/apps/blog/post-detail">
                                                        <span className="nav-link-text">Post Detail</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                        </Nav.Item>
                                    </Nav>
                                </Nav.Item>
                                <Nav.Item as="li">
                                </Nav.Item>
                                <Nav.Item as="li">
                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/auth" data-bs-toggle="collapse" data-bs-target="#dash_pages">
                                        <span className="nav-icon-wrap">
                                            <span className="svg-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user-plus" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <circle cx={9} cy={7} r={4} />
                                                    <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                                    <path d="M16 11h6m-3 -3v6" />
                                                </svg>
                                            </span>
                                        </span>
                                        <span className="nav-link-text">Authentication</span>
                                    </Nav.Link>
                                    <Nav as="ul" id="dash_pages" className="flex-column collapse  nav-children">
                                        <Nav.Item as="li">
                                            <Nav as="ul" className="flex-column">
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/auth" data-bs-toggle="collapse" data-bs-target="#dash_log">
                                                        <span className="nav-link-text">Log In</span>
                                                    </Nav.Link>
                                                    <Nav as="ul" id="dash_log" className="flex-column collapse  nav-children">
                                                        <Nav.Item as="li">
                                                            <Nav as="ul" className="flex-column">
                                                                <Nav.Item as="li">
                                                                    <Nav.Link as={NavLink} activeClassName="active" to="/auth/login">
                                                                        <span className="nav-link-text">Login</span>
                                                                    </Nav.Link>
                                                                </Nav.Item>
                                                            </Nav>
                                                        </Nav.Item>
                                                    </Nav>
                                                </Nav.Item>
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/auth" data-bs-toggle="collapse" data-bs-target="#dash_sign">
                                                        <span className="nav-link-text">Sign Up</span>
                                                    </Nav.Link>
                                                    <Nav as="ul" id="dash_sign" className="flex-column collapse  nav-children">
                                                        <Nav.Item as="li">
                                                            <Nav as="ul" className="flex-column">
                                                                <Nav.Item as="li">
                                                                    <Nav.Link as={NavLink} activeClassName="active" to="/auth/signup">
                                                                        <span className="nav-link-text">Signup Classic</span>
                                                                    </Nav.Link>
                                                                </Nav.Item>
                                                            </Nav>
                                                        </Nav.Item>
                                                    </Nav>
                                                </Nav.Item>
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/auth/lock-screen">
                                                        <span className="nav-link-text">Lock Screen</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/auth/reset-password">
                                                        <span className="nav-link-text">Reset Password</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/auth/error-404">
                                                        <span className="nav-link-text">Error 404</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/auth/error-503">
                                                        <span className="nav-link-text">Error 503</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                        </Nav.Item>
                                    </Nav>
                                </Nav.Item>
                                <Nav.Item as="li">
                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/pages" data-bs-toggle="collapse" data-bs-target="#dash_profile">
                                        <span className="nav-icon-wrap">
                                            <span className="svg-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user-search" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <circle cx={12} cy={7} r={4} />
                                                    <path d="M6 21v-2a4 4 0 0 1 4 -4h1" />
                                                    <circle cx="16.5" cy="17.5" r="2.5" />
                                                    <path d="M18.5 19.5l2.5 2.5" />
                                                </svg>
                                            </span>
                                        </span>
                                        <span className="nav-link-text">Profile</span>
                                    </Nav.Link>
                                    <Nav as="ul" id="dash_profile" className="flex-column collapse  nav-children">
                                        <Nav.Item as="li">
                                            <Nav as="ul" className="nav flex-column">
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/pages/profile">
                                                        <span className="nav-link-text">Profile</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/pages/edit-profile">
                                                        <span className="nav-link-text">Edit Profile</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item as="li">
                                                    <Nav.Link as={NavLink} activeClassName="active" to="/horizontal/pages/account">
                                                        <span className="nav-link-text">Account</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                        </Nav.Item>
                                    </Nav>
                                </Nav.Item>
                                <Nav.Item as="li">
                                    <a className="nav-link" href="https://nubra-ui-react.netlify.app/introduction" target="_blank" rel="noreferrer">
                                        <span className="nav-icon-wrap">
                                            <span className="svg-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file-code-2" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M10 12h-1v5h1" />
                                                    <path d="M14 12h1v5h-1" />
                                                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                                </svg>
                                            </span>
                                        </span>
                                        <span className="nav-link-text">Documentation</span>
                                    </a>
                                </Nav.Item>
                                <Nav.Item as="li">
                                    <a className="nav-link" href="https://nubra-ui-react.netlify.app/avatar" target="_blank" rel="noreferrer">
                                        <span className="nav-icon-wrap">
                                            <span className="svg-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-layout" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <rect x={4} y={4} width={6} height={5} rx={2} />
                                                    <rect x={4} y={13} width={6} height={7} rx={2} />
                                                    <rect x={14} y={4} width={6} height={16} rx={2} />
                                                </svg>
                                            </span>
                                        </span>
                                        <span className="nav-link-text">Components</span>
                                    </a>
                                </Nav.Item>
                            </Nav>
                        </Container>
                    </div>
                </SimpleBar>

                {/* /Main Menu */}
            </div>
            <div id="hk_menu_backdrop" className="hk-menu-backdrop" />

        </>
    )
}

export default HorizontalNav
