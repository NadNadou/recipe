import React, {useState} from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import classNames from 'classnames';
import { Archive, ChevronDown, ChevronUp,Plus, Grid, List, MoreVertical, RefreshCw, Star, User } from 'react-feather';
import { connect } from 'react-redux';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { toggleTopNav } from '../../redux/action/Theme';
import HkTooltip from '../../components/@hk-tooltip/HkTooltip';

import CreateNewIngredient from './CreateNewIngredient';
import { useHistory } from 'react-router-dom';


const IngredientAppHeader = ({ topNavCollapsed, toggleTopNav, toggleSidebar, show }) => {
    const history = useHistory();
    const contactListRoute = useRouteMatch("/apps/contacts/contact-list");

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCreateIngredient, setShowCreateIngredient] = useState(false)


    return (
        <header className="contact-header">
            <div className="d-flex align-items-center">
                <Dropdown>
                    <Dropdown.Toggle as="a" className="contactapp-title link-dark" href="#" >
                        <h1>Ingredients</h1>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item>
                            <span className="feather-icon dropdown-icon">
                                <User />
                            </span>
                            <span>All ingredients</span>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <span className="feather-icon dropdown-icon">
                                <Archive />
                            </span>
                            <span>Archive</span>
                        </Dropdown.Item>
                       
                    </Dropdown.Menu>
                </Dropdown>

                <Button variant="light" size="xs" className="btn-icon btn-rounded ms-2" onClick={() => setShowCreateIngredient(true)} >
                    <HkTooltip placement="top" title="Add ingredient">
                        <span className="feather-icon">
                            <Plus />
                        </span>
                    </HkTooltip>
                </Button>
            </div>
            <div className="contact-options-wrap">
                <Dropdown className="inline-block" >
                    <Dropdown.Toggle as="a" href="#" className="btn btn-icon btn-flush-dark flush-soft-hover no-caret active">
                        <span className="icon">
                            <span className="feather-icon">
                                {contactListRoute ? <List /> : <Grid />}
                            </span>
                        </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                        <Dropdown.Item as={NavLink} to="contact-list" activeClassName="active" ><span className="feather-icon dropdown-icon">
                            <List />
                        </span>
                            <span>List View</span>
                        </Dropdown.Item>
                        <Dropdown.Item as={NavLink} to="contact-cards" activeClassName="active">
                            <span className="feather-icon dropdown-icon">
                                <Grid />
                            </span>
                            <span>Grid View</span>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Button as="a" variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover no-caret d-sm-inline-block d-none" href="#">
                    <HkTooltip title="Refresh" placement="top" >
                        <span className="icon">
                            <span className="feather-icon">
                                <RefreshCw />
                            </span>
                        </span>
                    </HkTooltip>
                </Button>
                <div className="v-separator d-lg-block d-none" />
                <Dropdown className="inline-block ms-1">
                    <Dropdown.Toggle as="a" href="#" className="btn btn-flush-dark btn-icon btn-rounded btn-flush-dark flush-soft-hover no-caret d-lg-inline-block d-none">
                        <HkTooltip placement="top" title="More">
                            <span className="icon">
                                <span className="feather-icon">
                                    <MoreVertical />
                                </span>
                            </span>
                        </HkTooltip>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                        <Dropdown.Item>
                            <span className="feather-icon dropdown-icon">
                                <Star />
                            </span>
                            <span>Stared Recipes</span>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <span className="feather-icon dropdown-icon">
                                <Archive />
                            </span>
                            <span>Archive Recipes</span>
                        </Dropdown.Item>
                       
                    </Dropdown.Menu>
                </Dropdown>
                <Button as="a" href="#" className="btn-icon btn-flush-dark btn-rounded flush-soft-hover hk-navbar-togglable d-sm-inline-block d-none" onClick={() => toggleTopNav(!topNavCollapsed)} >
                    <HkTooltip placement={topNavCollapsed ? "bottom" : "top"} title="Collapse" >
                        <span className="icon">
                            <span className="feather-icon">
                                {
                                    topNavCollapsed ? <ChevronDown /> : <ChevronUp />
                                }
                            </span>
                        </span>
                    </HkTooltip>
                </Button>
            </div>
            <div className={classNames("hk-sidebar-togglable", { "active": show })} onClick={toggleSidebar} />

            <CreateNewIngredient show={showCreateModal} close={() => setShowCreateModal(false)} />
            <CreateNewIngredient show={showCreateIngredient} close={() => setShowCreateIngredient(false)} />

        </header>
    )
}

const mapStateToProps = ({ theme }) => {
    const { topNavCollapsed } = theme;
    return { topNavCollapsed }
};

export default connect(mapStateToProps, { toggleTopNav })(IngredientAppHeader);