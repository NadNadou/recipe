import React, { useEffect, useState, useMemo } from 'react';
import { Button, Card, Col, Row, Badge, Modal, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import SimpleBar from 'simplebar-react';
import { ChevronLeft, ChevronRight, Plus, X, Zap } from 'react-feather';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { getAllPlans, createPlan, deletePlan, updatePlan, getBatchSessions } from '../../redux/action/Plans';
import { getAllRecipes } from '../../redux/action/Recipes';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Lunchbox', 'Babyfood'];

const TwoWeekPlanner = () => {
  const dispatch = useDispatch();
  const { plans, batchSessions } = useSelector(state => state.planReducer);
  const { recipes } = useSelector(state => state.recipeReducer);
  const { mealTypes } = useSelector(state => state.metadataReducer);

  const [startDate, setStartDate] = useState(moment().startOf('isoWeek').toDate());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);

  // Form state for adding
  const [selectedRecipe, setSelectedRecipe] = useState('');
  const [servings, setServings] = useState(1);
  const [notes, setNotes] = useState('');
  const [useFromBatch, setUseFromBatch] = useState(false);
  const [selectedBatchSession, setSelectedBatchSession] = useState('');

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editMealType, setEditMealType] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => {
    dispatch(getAllPlans());
    dispatch(getAllRecipes());
    dispatch(getBatchSessions());
  }, [dispatch]);

  // Generate 28 days from startDate (4 weeks)
  const days = useMemo(() => {
    const result = [];
    for (let i = 0; i < 28; i++) {
      result.push(moment(startDate).add(i, 'days'));
    }
    return result;
  }, [startDate]);

  // Group plans by date and mealType
  const plansByDateAndType = useMemo(() => {
    const map = {};
    plans.forEach(plan => {
      // Parse date in local timezone to avoid timezone shift issues
      const planDate = plan.date ? plan.date.split('T')[0] : '';
      const dateKey = planDate;
      const key = `${dateKey}-${plan.mealType}`;
      if (!map[key]) map[key] = [];
      map[key].push(plan);
    });
    return map;
  }, [plans]);

  // Calculate calories per meal and per day
  const caloriesByDateAndType = useMemo(() => {
    const map = {};
    const dailyTotals = {};

    plans.forEach(plan => {
      // Parse date in local timezone to avoid timezone shift issues
      const dateKey = plan.date ? plan.date.split('T')[0] : '';
      const key = `${dateKey}-${plan.mealType}`;

      const caloriesPerPortion = plan.recipeId?.nutrition?.caloriesPerPortion || 0;
      const planCalories = caloriesPerPortion * (plan.servings || 1);

      if (!map[key]) map[key] = 0;
      map[key] += planCalories;

      if (!dailyTotals[dateKey]) dailyTotals[dateKey] = 0;
      dailyTotals[dateKey] += planCalories;
    });

    return { byMeal: map, byDay: dailyTotals };
  }, [plans]);

  const handlePrevWeek = () => {
    setStartDate(moment(startDate).subtract(1, 'week').toDate());
  };

  const handleNextWeek = () => {
    setStartDate(moment(startDate).add(1, 'week').toDate());
  };

  const handleToday = () => {
    setStartDate(moment().startOf('isoWeek').toDate());
  };

  // Check if a day is in the past
  const isPastDay = (day) => {
    return day.isBefore(moment().startOf('day'));
  };

  // Filter batch sessions by selected recipe
  const availableBatchSessions = useMemo(() => {
    if (!selectedRecipe || !batchSessions) return [];
    return batchSessions.filter(
      session => session.recipeId?._id === selectedRecipe && session.remainingPortions > 0
    );
  }, [selectedRecipe, batchSessions]);

  const handleCellClick = (day, mealType) => {
    // Don't allow adding to past days
    if (isPastDay(day)) return;

    setSelectedCell({ date: day.toDate(), mealType });
    setSelectedRecipe('');
    setServings(1);
    setNotes('');
    setUseFromBatch(false);
    setSelectedBatchSession('');
    setShowAddModal(true);
  };

  const handlePlanClick = (plan, e) => {
    e.stopPropagation();
    setSelectedPlan(plan);
    setEditMealType(plan.mealType);
    // Parse date without timezone conversion
    setEditDate(plan.date ? plan.date.split('T')[0] : '');
    setEditNotes(plan.notes || '');
    setShowEditModal(true);
  };

  const handleUpdatePlan = async () => {
    if (!selectedPlan) return;

    // Validate date is not in the past
    if (moment(editDate).isBefore(moment().startOf('day'))) {
      alert('Cannot set date to a past day');
      return;
    }

    await dispatch(updatePlan(selectedPlan._id, {
      mealType: editMealType,
      date: editDate,
      notes: editNotes,
    }));

    setShowEditModal(false);
    dispatch(getAllPlans());
  };

  const handleAddPlan = async () => {
    if (!selectedRecipe || !selectedCell) return;

    // If using from batch but no batch selected, show error
    if (useFromBatch && !selectedBatchSession) {
      alert('Please select a batch session');
      return;
    }

    // Format date as YYYY-MM-DD to avoid timezone issues
    const dateStr = moment(selectedCell.date).format('YYYY-MM-DD');

    const payload = {
      recipeId: selectedRecipe,
      date: dateStr,
      mealType: selectedCell.mealType,
      servings: useFromBatch ? 1 : servings, // Batch portions are always 1
      notes,
      ...(useFromBatch && selectedBatchSession && { batchSessionId: selectedBatchSession })
    };

    await dispatch(createPlan(payload));
    setShowAddModal(false);
    dispatch(getAllPlans());
    dispatch(getBatchSessions()); // Refresh batch sessions to update counts
  };

  const handleDeletePlan = async (planId, e) => {
    e.stopPropagation();
    await dispatch(deletePlan(planId));
    dispatch(getAllPlans());
    dispatch(getBatchSessions()); // Refresh batch sessions in case it was from batch
  };

  const getMealTypeColor = (mealType) => {
    const type = mealTypes.find(t => t.label === mealType);
    return type?.backgroundColor || '#ccc';
  };

  const selectedRecipeData = recipes?.find(r => r._id === selectedRecipe);

  // Get calories for a plan
  const getPlanCalories = (plan) => {
    const caloriesPerPortion = plan.recipeId?.nutrition?.caloriesPerPortion || 0;
    return Math.round(caloriesPerPortion * (plan.servings || 1));
  };

  const renderWeek = (weekDays, weekNumber) => (
    <Card className="mb-3" key={weekNumber}>
      <Card.Header className="py-2">
        <span className="fw-semibold">
          Week {weekNumber} : {weekDays[0].format('D MMM')} - {weekDays[6].format('D MMM YYYY')}
        </span>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="table-responsive">
          <table className="table table-bordered mb-0" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th style={{ width: '100px' }}></th>
                {weekDays.map(day => (
                  <th
                    key={day.format('YYYY-MM-DD')}
                    className={`text-center ${day.isSame(moment(), 'day') ? 'bg-primary text-white' : ''} ${isPastDay(day) ? 'bg-light text-muted' : ''}`}
                    style={{ fontSize: '0.8rem' }}
                  >
                    <div>{day.format('ddd')}</div>
                    <div className="fw-bold">{day.format('D')}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MEAL_TYPES.map(mealType => (
                <tr key={mealType}>
                  <td
                    className="align-middle text-center"
                    style={{
                      backgroundColor: getMealTypeColor(mealType),
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {mealType}
                  </td>
                  {weekDays.map(day => {
                    const dateKey = day.format('YYYY-MM-DD');
                    const cellKey = `${dateKey}-${mealType}`;
                    const cellPlans = plansByDateAndType[cellKey] || [];
                    const cellCalories = caloriesByDateAndType.byMeal[cellKey] || 0;
                    const past = isPastDay(day);

                    return (
                      <td
                        key={cellKey}
                        className={`p-1 position-relative ${past ? 'bg-light' : ''}`}
                        style={{
                          minHeight: '60px',
                          verticalAlign: 'top',
                          cursor: past ? 'not-allowed' : 'pointer',
                          opacity: past ? 0.6 : 1
                        }}
                        onClick={() => handleCellClick(day, mealType)}
                      >
                        {cellPlans.map(plan => (
                          <OverlayTrigger
                            key={plan._id}
                            placement="top"
                            overlay={
                              <Tooltip>
                                <strong>{plan.recipeId?.title}</strong>
                                <br />
                                {getPlanCalories(plan)} kcal
                                {plan.isBatchCooked && <><br /><em>(Batch)</em></>}
                              </Tooltip>
                            }
                          >
                            <div
                              className="d-flex align-items-center justify-content-between mb-1 p-1 rounded"
                              style={{
                                backgroundColor: plan.isBatchCooked
                                  ? '#78909C22'
                                  : getMealTypeColor(mealType) + '22',
                                fontSize: '0.7rem',
                                border: `1px solid ${plan.isBatchCooked ? '#78909C' : getMealTypeColor(mealType)}`,
                                cursor: 'pointer'
                              }}
                              onClick={(e) => handlePlanClick(plan, e)}
                            >
                              <span className="text-truncate" style={{ maxWidth: '70%' }}>
                                {plan.isBatchCooked && <Zap size={10} className="me-1" />}
                                {plan.recipeId?.title?.substring(0, 12)}
                                {plan.recipeId?.title?.length > 12 && '...'}
                              </span>
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 text-danger"
                                onClick={(e) => handleDeletePlan(plan._id, e)}
                              >
                                <X size={12} />
                              </Button>
                            </div>
                          </OverlayTrigger>
                        ))}
                        {/* Always show + button to add more recipes (unless past day) */}
                        {!past && (
                          <div
                            className="text-center text-muted"
                            style={{
                              fontSize: '0.7rem',
                              opacity: cellPlans.length > 0 ? 0.4 : 0.5,
                              cursor: 'pointer',
                              padding: '2px',
                              borderRadius: '4px',
                              transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = cellPlans.length > 0 ? 0.4 : 0.5}
                          >
                            <Plus size={14} />
                            {cellPlans.length > 0 && <span style={{ fontSize: '0.6rem' }}> Add</span>}
                          </div>
                        )}
                        {/* Show meal calories if any */}
                        {cellCalories > 0 && (
                          <div className="text-end" style={{ fontSize: '0.6rem', color: '#888' }}>
                            {Math.round(cellCalories)} kcal
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Daily totals row */}
              <tr>
                <td
                  className="align-middle text-center fw-bold"
                  style={{ fontSize: '0.75rem', backgroundColor: '#f8f9fa' }}
                >
                  Total
                </td>
                {weekDays.map(day => {
                  const dateKey = day.format('YYYY-MM-DD');
                  const dayCalories = caloriesByDateAndType.byDay[dateKey] || 0;
                  const past = isPastDay(day);

                  return (
                    <td
                      key={`total-${dateKey}`}
                      className={`text-center fw-bold ${past ? 'bg-light' : ''}`}
                      style={{
                        fontSize: '0.75rem',
                        backgroundColor: past ? '#f0f0f0' : '#f8f9fa',
                        color: dayCalories > 2500 ? '#dc3545' : dayCalories > 2000 ? '#fd7e14' : '#198754'
                      }}
                    >
                      {dayCalories > 0 ? `${Math.round(dayCalories)} kcal` : '-'}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="hk-pg-body">
      <Card className="card-border mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">4-Week Meal Planner</h5>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" size="sm" onClick={handlePrevWeek}>
              <ChevronLeft size={16} />
            </Button>
            <Button variant="outline-primary" size="sm" onClick={handleToday}>
              Today
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={handleNextWeek}>
              <ChevronRight size={16} />
            </Button>
          </div>
        </Card.Header>
      </Card>

      <SimpleBar style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {renderWeek(days.slice(0, 7), 1)}
        {renderWeek(days.slice(7, 14), 2)}
        {renderWeek(days.slice(14, 21), 3)}
        {renderWeek(days.slice(21, 28), 4)}
      </SimpleBar>

      {/* Meals from Batch Cooking */}
      <Card className="mt-3">
        <Card.Header>
          <h6 className="mb-0">Meals from Batch Cooking</h6>
        </Card.Header>
        <Card.Body>
          {plans.filter(p => p.isBatchCooked).length === 0 ? (
            <p className="text-muted mb-0">No meals from batch cooking in this period</p>
          ) : (
            <Row>
              {plans
                .filter(p => p.isBatchCooked)
                .filter(p => moment(p.date).isBetween(days[0], days[27], 'day', '[]'))
                .map(plan => (
                  <Col md={3} key={plan._id} className="mb-2">
                    <div className="p-2 rounded" style={{ backgroundColor: '#78909C22', border: '1px solid #78909C' }}>
                      <div className="fw-semibold text-truncate">{plan.recipeId?.title}</div>
                      <small className="text-muted">
                        {moment(plan.date).format('ddd D MMM')} - {plan.mealType}
                      </small>
                    </div>
                  </Col>
                ))}
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Add Plan Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Add {selectedCell?.mealType} - {selectedCell && moment(selectedCell.date).format('ddd D MMM')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Recipe</Form.Label>
              <Form.Select
                value={selectedRecipe}
                onChange={(e) => {
                  setSelectedRecipe(e.target.value);
                  setUseFromBatch(false);
                  setSelectedBatchSession('');
                }}
              >
                <option value="">-- Select a recipe --</option>
                {recipes?.map(r => (
                  <option key={r._id} value={r._id}>
                    {r.title}
                    {r.isBatchCookingDefault && ' [Batch]'}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Batch cooking option - only show if recipe has available batches */}
            {selectedRecipe && availableBatchSessions.length > 0 && (
              <Form.Group className="mb-3">
                <Form.Check
                  type="switch"
                  id="use-from-batch"
                  label={
                    <span>
                      <Zap size={14} className="me-1" style={{ color: '#78909C' }} />
                      Use from Batch Cooking
                    </span>
                  }
                  checked={useFromBatch}
                  onChange={(e) => {
                    setUseFromBatch(e.target.checked);
                    if (!e.target.checked) {
                      setSelectedBatchSession('');
                    }
                  }}
                />
              </Form.Group>
            )}

            {/* Batch session selector */}
            {useFromBatch && availableBatchSessions.length > 0 && (
              <Form.Group className="mb-3">
                <Form.Label>Select Batch Session</Form.Label>
                <Form.Select
                  value={selectedBatchSession}
                  onChange={(e) => setSelectedBatchSession(e.target.value)}
                >
                  <option value="">-- Select a batch --</option>
                  {availableBatchSessions.map(session => (
                    <option key={session._id} value={session._id}>
                      {moment(session.preparedDate).format('DD/MM/YYYY')} - {session.remainingPortions} portions left
                    </option>
                  ))}
                </Form.Select>
                {selectedBatchSession && (
                  <Form.Text className="text-muted">
                    1 portion will be deducted from this batch
                  </Form.Text>
                )}
              </Form.Group>
            )}

            {/* Servings - only show if NOT using from batch */}
            {!useFromBatch && (
              <Form.Group className="mb-3">
                <Form.Label>Servings</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                />
              </Form.Group>
            )}

            {selectedRecipeData && (
              <div className="p-2 bg-light rounded mb-3">
                <small>
                  <strong>Calories:</strong> {selectedRecipeData.nutrition?.caloriesPerPortion || 0} kcal/portion
                  <br />
                  <strong>Total:</strong> {Math.round((selectedRecipeData.nutrition?.caloriesPerPortion || 0) * (useFromBatch ? 1 : servings))} kcal
                </small>
                {useFromBatch && (
                  <>
                    <br />
                    <Badge bg="secondary" className="mt-1">
                      <Zap size={10} className="me-1" />
                      From Batch Cooking
                    </Badge>
                  </>
                )}
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddPlan}
            disabled={!selectedRecipe || (useFromBatch && !selectedBatchSession)}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Plan Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Edit Plan - {selectedPlan?.recipeId?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Meal Type</Form.Label>
              <Form.Select
                value={editMealType}
                onChange={(e) => setEditMealType(e.target.value)}
              >
                {mealTypes.map(type => (
                  <option key={type.value} value={type.label}>
                    {type.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={editDate}
                min={moment().format('YYYY-MM-DD')}
                onChange={(e) => setEditDate(e.target.value)}
              />
            </Form.Group>

            {selectedPlan && (
              <div className="p-2 bg-light rounded mb-3">
                <small>
                  <strong>Calories:</strong> {getPlanCalories(selectedPlan)} kcal
                  {selectedPlan.isBatchCooked && (
                    <>
                      <br />
                      <Badge bg="secondary">From Batch Cooking</Badge>
                    </>
                  )}
                </small>
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdatePlan}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TwoWeekPlanner;
