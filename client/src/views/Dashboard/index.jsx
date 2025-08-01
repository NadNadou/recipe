import React, { useEffect} from 'react';
import {useDispatch, useSelector } from 'react-redux';
import { Col, Container, Form, InputGroup, Nav, Row, Tab } from 'react-bootstrap';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import { Calendar } from 'react-feather';
import ActiveUserCard from './ActiveUserCard';
import WeeklyRecipePlanner from './WeeklyRecipePlanner';
import CustomerTable from './CustomerTable';
import DailyGroceryList from './DailyGroceryList';
import { connect } from 'react-redux';
import { toggleCollapsedNav } from '../../redux/action/Theme';
import WeeklyCaloriesChart from './ChartData/WeeklyCaloriesChart';

const Dashboard = ({ navCollapsed, toggleCollapsedNav }) => {

    useEffect(() => {
        toggleCollapsedNav(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Container>
                <Tab.Container activeKey="overview">
                    {/* Page Header */}
                    <div className="hk-pg-header pg-header-wth-tab pt-7">
                        <div className="d-flex">
                            <div className="d-flex flex-wrap justify-content-between flex-1">
                                <div className="mb-lg-0 mb-2 me-8">
                                    <h1 className="pg-title">Recipe planner</h1>
                                </div>
                                <div className="pg-header-action-wrap">
                                    <InputGroup className="w-300p">
                                        <span className="input-affix-wrapper">
                                            <span className="input-prefix">
                                                <span className="feather-icon">
                                                    <Calendar />
                                                </span>
                                            </span>
                                            <DateRangePicker
                                                initialSettings={{
                                                    timePicker: true,
                                                    startDate: moment().startOf('hour').toDate(),
                                                    endDate: moment().startOf('hour').add(32, 'hour').toDate(),
                                                    locale: {
                                                        format: 'M/DD hh:mm A',
                                                    },
                                                }}
                                            >
                                                <Form.Control type="text" name="datetimes" />
                                            </DateRangePicker>
                                        </span>
                                    </InputGroup>
                                </div>
                            </div>
                        </div>
                        <Nav variant="tabs" className="nav-light nav-line">
                            <Nav.Item>
                                <Nav.Link eventKey="overview" >
                                    <span className="nav-link-text">Overview</span>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="demo_nav_1">
                                    <span className="nav-link-text">Other</span>
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>
                    {/* /Page Header */}
                    {/* Page Body */}
                    <div className="hk-pg-body">
                        <Tab.Content>
                            <Tab.Pane eventKey="overview" >
                                <Row>
                                    <Col xxl={9} lg={8} md={7} className="mb-md-4 mb-3">
                                        <WeeklyRecipePlanner />
                                    </Col>
                                    <Col xxl={3} lg={4} md={5} className="mb-md-4 mb-3">
                                        <DailyGroceryList />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12} className="mb-md-4 mb-3">
                                        <WeeklyCaloriesChart/>
                                    </Col>
                                </Row>
                               
                            </Tab.Pane>
                            <Tab.Pane eventKey="demo_nav_1" />
                            <Tab.Pane eventKey="demo_nav_2" />
                        </Tab.Content>
                    </div>
                    {/* /Page Body */}
                </Tab.Container>
            </Container>
        </>
    )
}

// export default Dashboard
const mapStateToProps = ({ theme }) => {
    const { navCollapsed } = theme;
    return { navCollapsed }
};

export default connect(mapStateToProps, { toggleCollapsedNav })(Dashboard);