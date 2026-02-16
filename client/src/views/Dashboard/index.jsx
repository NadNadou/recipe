import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Col, Container, Form, Modal, Nav, Row, Tab } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import WeeklyRecipePlanner from './WeeklyRecipePlanner';
import DailyGroceryList from './DailyGroceryList';
import BatchPile from './BatchPile';
import { connect } from 'react-redux';
import { toggleCollapsedNav } from '../../redux/action/Theme';
import WeeklyCaloriesChart from './ChartData/WeeklyCaloriesChart';
import { createPlan, getAllPlans, getBatchSessions } from '../../redux/action/Plans';

const Dashboard = ({ toggleCollapsedNav }) => {
    const dispatch = useDispatch();

    // State for assign portion modal
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [selectedMealType, setSelectedMealType] = useState('');
    const [assignDate, setAssignDate] = useState(new Date());

    useEffect(() => {
        toggleCollapsedNav(false);
        dispatch(getAllPlans());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handler when user clicks a portion button in BatchPile
    const handleAssignPortion = (session, mealType) => {
        setSelectedSession(session);
        setSelectedMealType(mealType);
        setAssignDate(new Date());
        setShowAssignModal(true);
    };

    // Confirm assignment
    const handleConfirmAssign = async () => {
        if (!selectedSession || !selectedMealType) return;

        // Format date as YYYY-MM-DD to avoid timezone issues
        const dateStr = moment(assignDate).format('YYYY-MM-DD');

        await dispatch(createPlan({
            recipeId: selectedSession.recipeId._id,
            date: dateStr,
            mealType: selectedMealType,
            servings: 1,
            batchSessionId: selectedSession._id,
        }));

        setShowAssignModal(false);
        dispatch(getAllPlans());
        dispatch(getBatchSessions());
    };

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
                            </div>
                        </div>
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
                                        <BatchPile onAssignPortion={handleAssignPortion} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xxl={8} lg={8} md={7} className="mb-md-4 mb-3">
                                        <WeeklyCaloriesChart/>
                                    </Col>
                                    <Col xxl={4} lg={4} md={5} className="mb-md-4 mb-3">
                                        <DailyGroceryList />
                                    </Col>
                                </Row>
                            </Tab.Pane>
                            <Tab.Pane eventKey="demo_nav_1" />
                            <Tab.Pane eventKey="demo_nav_2" />
                        </Tab.Content>
                    </div>
                    {/* /Page Body */}
                </Tab.Container>

                {/* Assign Portion Modal */}
                <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Assign Portion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedSession && (
                            <>
                                <p>
                                    <strong>Recipe:</strong> {selectedSession.recipeId?.title}
                                </p>
                                <p>
                                    <strong>Meal type:</strong> {selectedMealType}
                                </p>
                                <Form.Group className="mb-3">
                                    <Form.Label>Select date</Form.Label>
                                    <DatePicker
                                        selected={assignDate}
                                        onChange={(date) => setAssignDate(date)}
                                        dateFormat="dd/MM/yyyy"
                                        minDate={new Date()}
                                        maxDate={moment().add(28, 'days').toDate()}
                                        className="form-control"
                                        inline
                                    />
                                </Form.Group>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleConfirmAssign}>
                            Assign to {moment(assignDate).format('D MMM')}
                        </Button>
                    </Modal.Footer>
                </Modal>
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