import React, { useEffect, useState} from 'react';
import { Button, ButtonGroup, Card, Col, Form, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import moment from 'moment';

import RecipeFullCalendar from "../Calendar/RecipeFullCalendar"

const WeeklyRecipePlanner = () => {
    useEffect(() => {
        window.dispatchEvent(new Event('resize'))
    }, [])

    const [filter, setFilter] = useState('All');

    const { plans } = useSelector(state => state.planReducer);
    const currentMonth = moment().month();
    const currentYear = moment().year();

    const currentMonthPlans = plans.filter(plan => {
    const planDate = moment(plan.date);
    return planDate.month() === currentMonth && planDate.year() === currentYear;
    });

    const uniqueRecipes = new Set(currentMonthPlans.map(p => p.recipeId?._id).filter(Boolean));
    const totalPossible = moment().daysInMonth() * 3;

    const babyMeals = currentMonthPlans.filter(p => p.mealType === 'Babyfood').length;
    const batchMeals = currentMonthPlans.filter(p => !!p.parentPlanId).length;

    const totalPrepTime = currentMonthPlans.reduce((acc, p) => acc + (p.recipeId?.prepTime || 0) + (p.recipeId?.cookTime || 0), 0);
    const hours = Math.floor(totalPrepTime / 60);
    const minutes = totalPrepTime % 60;


    return (
        <Card className="card-border mb-0 h-100">
            <Card.Header className="card-header-action">
                <h6>Monthly overview</h6>
                <div className="card-action-wrap">
                <ButtonGroup className="d-lg-flex d-none" aria-label="Filter">
                    {['All', 'Babyfood', 'Lunch / diner', 'Snack'].map((label) => (
                        <Button
                        key={label}
                        variant={filter === label ? "primary" : "outline-light"} // <- change visuellement
                        onClick={() => setFilter(label)}
                        >
                        {label}
                        </Button>
                    ))}
                </ButtonGroup>

                    <Form.Select className="d-lg-none d-flex">
                        <option value={1}>All</option>
                        <option value={2}>Sessions</option>
                        <option value={3}>Source</option>
                        <option value={4}>Referrals</option>
                    </Form.Select>
                </div>
            </Card.Header>
            <Card.Body>
                {/* <AudienceReviewChart /> */}
                <RecipeFullCalendar filter={filter}/>
                <div className="separator-full mt-5" />
                <div className="flex-grow-1 ms-lg-3">
                <Row>
                    <Col xxl={3} sm={6} className="mb-3">
                        <span className="d-block fw-medium fs-7">Planned recipes</span>
                        <div className="d-flex align-items-center">
                        <span className="d-block fs-4 fw-medium text-dark mb-0">{uniqueRecipes.size}</span>
                        </div>
                    </Col>
                    <Col xxl={3} sm={6} className="mb-3">
                        <span className="d-block fw-medium fs-7">Baby food</span>
                        <div className="d-flex align-items-center">
                        <span className="d-block fs-4 fw-medium text-dark mb-0">{babyMeals}</span>
                        </div>
                    </Col>
                    <Col xxl={3} sm={6} className="mb-3">
                        <span className="d-block fw-medium fs-7">Average cooking time</span>
                        <div className="d-flex align-items-center">
                        <span className="d-block fs-4 fw-medium text-dark mb-0">{hours}h {minutes}m</span>
                        </div>
                    </Col>
                    <Col xxl={3} sm={6}>
                        <span className="d-block fw-medium fs-7">Meal planned in advance</span>
                        <div className="d-flex align-items-center">
                        <span className="d-block fs-4 fw-medium text-dark mb-0">{batchMeals}</span>
                        </div>
                    </Col>
                </Row>

                </div>
            </Card.Body>
        </Card>
    )
}

export default WeeklyRecipePlanner
