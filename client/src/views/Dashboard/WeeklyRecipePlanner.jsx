import React, { useEffect, useState, useMemo } from 'react';
import { Button, ButtonGroup, Card, Col, Form, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import moment from 'moment';
import RecipeFullCalendar from "../Calendar/RecipeFullCalendar";

const WeeklyRecipePlanner = () => {
  // Force FullCalendar to recompute its layout on mount
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, []);

  const [filter, setFilter] = useState('All');
  const { plans } = useSelector(state => state.planReducer);

  const currentMonth = moment().month();
  const currentYear = moment().year();

  /* ---------------------------------------
      1. Filter plans of the current month
  ----------------------------------------*/
  const currentMonthPlans = useMemo(() => {
    return plans.filter(plan => {
      const d = moment(plan.date);
      return d.month() === currentMonth && d.year() === currentYear;
    });
  }, [plans, currentMonth, currentYear]);

  /* ---------------------------------------
      2. Analytics (memo)
  ----------------------------------------*/
  const stats = useMemo(() => {
    const uniqueRecipes = new Set(
      currentMonthPlans.map(p => p.recipeId?._id).filter(Boolean)
    );

    const babyMeals = currentMonthPlans.filter(
      p => p.mealType === 'Babyfood'
    ).length;

    const batchMeals = currentMonthPlans.filter(
      p => !!p.parentPlanId
    ).length;

    const totalPrepTime = currentMonthPlans.reduce((acc, p) => {
      const prep = p.recipeId?.prepTime || 0;
      const cook = p.recipeId?.cookTime || 0;
      return acc + prep + cook;
    }, 0);

    const hours = Math.floor(totalPrepTime / 60);
    const minutes = totalPrepTime % 60;

    return {
      uniqueCount: uniqueRecipes.size,
      babyMeals,
      batchMeals,
      hours,
      minutes
    };
  }, [currentMonthPlans]);


  return (
    <Card className="card-border mb-0 h-100">
      <Card.Header className="card-header-action">
        <h6>Monthly overview</h6>

        <div className="card-action-wrap">
          {/* Desktop filters */}
          <ButtonGroup className="d-lg-flex d-none" aria-label="Filter">
            {['All', 'Babyfood', 'Lunch / diner', 'Snack'].map(label => (
              <Button
                key={label}
                variant={filter === label ? "primary" : "outline-light"}
                onClick={() => setFilter(label)}
              >
                {label}
              </Button>
            ))}
          </ButtonGroup>

          {/* Mobile dropdown */}
          <Form.Select className="d-lg-none d-flex">
            <option>All</option>
            <option>Babyfood</option>
            <option>Lunch / diner</option>
            <option>Snack</option>
          </Form.Select>
        </div>
      </Card.Header>

      <Card.Body>
        <RecipeFullCalendar filter={filter} />

        <div className="separator-full mt-5" />

        <Row className="mt-3">
          <Col xxl={3} sm={6} className="mb-3">
            <span className="d-block fw-medium fs-7">Planned recipes</span>
            <span className="fs-4 fw-medium text-dark">{stats.uniqueCount}</span>
          </Col>

          <Col xxl={3} sm={6} className="mb-3">
            <span className="d-block fw-medium fs-7">Baby food</span>
            <span className="fs-4 fw-medium text-dark">{stats.babyMeals}</span>
          </Col>

          <Col xxl={3} sm={6} className="mb-3">
            <span className="d-block fw-medium fs-7">Average cooking time</span>
            <span className="fs-4 fw-medium text-dark">
              {stats.hours}h {stats.minutes}m
            </span>
          </Col>

          <Col xxl={3} sm={6}>
            <span className="d-block fw-medium fs-7">Meal planned in advance</span>
            <span className="fs-4 fw-medium text-dark">{stats.batchMeals}</span>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default WeeklyRecipePlanner;
