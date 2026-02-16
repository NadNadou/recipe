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

  // Date range for 4 weeks starting from today
  const startDate = moment().startOf('day');
  const endDate = moment().add(27, 'days').endOf('day');

  /* ---------------------------------------
      1. Filter plans for the next 4 weeks
  ----------------------------------------*/
  const fourWeekPlans = useMemo(() => {
    return plans.filter(plan => {
      const d = moment(plan.date);
      return d.isBetween(startDate, endDate, 'day', '[]');
    });
  }, [plans, startDate, endDate]);

  /* ---------------------------------------
      2. Analytics (memo)
  ----------------------------------------*/
  const stats = useMemo(() => {
    const uniqueRecipes = new Set(
      fourWeekPlans.map(p => p.recipeId?._id).filter(Boolean)
    );

    const babyMeals = fourWeekPlans.filter(
      p => p.mealType === 'Babyfood'
    ).length;

    const batchMeals = fourWeekPlans.filter(
      p => p.isBatchCooked === true
    ).length;

    const totalPrepTime = fourWeekPlans.reduce((acc, p) => {
      const prep = p.recipeId?.prepTime || 0;
      const cook = p.recipeId?.cookTime || 0;
      return acc + prep + cook;
    }, 0);

    const hours = Math.floor(totalPrepTime / 60);
    const minutes = Math.round(totalPrepTime % 60);

    return {
      uniqueCount: uniqueRecipes.size,
      babyMeals,
      batchMeals,
      hours,
      minutes
    };
  }, [fourWeekPlans]);


  return (
    <Card className="card-border mb-0 h-100">
      <Card.Header className="card-header-action">
        <h6>4-Week Planner ({startDate.format('D MMM')} - {endDate.format('D MMM')})</h6>

        <div className="card-action-wrap">
          {/* Desktop filters */}
          <ButtonGroup className="d-lg-flex d-none" aria-label="Filter">
            {['All', 'Meals', 'Lunchbox', 'Babyfood', 'Batch'].map(label => (
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
          <Form.Select
            className="d-lg-none d-flex"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Meals">Meals</option>
            <option value="Lunchbox">Lunchbox</option>
            <option value="Babyfood">Babyfood</option>
            <option value="Batch">From Batch</option>
          </Form.Select>
        </div>
      </Card.Header>

      <Card.Body>
        <RecipeFullCalendar filter={filter} twoWeekView={true} enableEdit={true} />

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
            <span className="d-block fw-medium fs-7">From batch cooking</span>
            <span className="fs-4 fw-medium text-dark">{stats.batchMeals}</span>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default WeeklyRecipePlanner;
