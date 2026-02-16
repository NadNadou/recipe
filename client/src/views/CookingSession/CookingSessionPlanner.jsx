import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Form, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRecipes } from '../../redux/action/Recipes';
import SimpleBar from 'simplebar-react';
import { Clock, Zap, TrendingDown } from 'react-feather';
import { calculateSessionTimeline } from './sessionUtils';

const CookingSessionPlanner = () => {
  const dispatch = useDispatch();
  const { recipes } = useSelector(state => state.recipeReducer);
  const { cookingAppliances } = useSelector(state => state.metadataReducer);

  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getAllRecipes());
  }, [dispatch]);

  const selectedRecipes = useMemo(
    () => (recipes || []).filter(r => selectedRecipeIds.includes(r._id)),
    [recipes, selectedRecipeIds]
  );

  const analysis = useMemo(
    () => calculateSessionTimeline(selectedRecipes, cookingAppliances),
    [selectedRecipes, cookingAppliances]
  );

  const filteredRecipes = useMemo(() => {
    if (!recipes) return [];
    if (!searchTerm) return recipes;
    return recipes.filter(r =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [recipes, searchTerm]);

  const toggleRecipe = (recipeId) => {
    setSelectedRecipeIds(prev =>
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const getApplianceMeta = (value) =>
    cookingAppliances.find(a => a.value === value) || { label: value, icon: '?', color: '#ccc' };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h${m}` : `${h}h`;
  };

  // ── Timeline: compute max time for scaling bars ──
  const maxTrackTime = analysis.totalTime || 1;

  // Group tracks by appliance for rendering
  const tracksByAppliance = useMemo(() => {
    const grouped = {};
    analysis.tracks.forEach(slot => {
      if (!grouped[slot.appliance]) grouped[slot.appliance] = [];
      grouped[slot.appliance].push(slot);
    });
    return grouped;
  }, [analysis.tracks]);

  return (
    <div className="hk-pg-body">
      <Row>
        {/* ── Left panel: recipe selection ── */}
        <Col lg={4}>
          <Card className="card-border mb-3">
            <Card.Header>
              <h6 className="mb-0">Select Recipes</h6>
            </Card.Header>
            <Card.Body>
              <Form.Control
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="mb-3"
              />
              <SimpleBar style={{ maxHeight: '65vh' }}>
                {filteredRecipes.map(recipe => {
                  const isSelected = selectedRecipeIds.includes(recipe._id);
                  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
                  return (
                    <div
                      key={recipe._id}
                      className={`d-flex align-items-center p-2 mb-1 rounded ${isSelected ? 'border border-primary' : ''}`}
                      style={{
                        backgroundColor: isSelected ? '#e3f2fd' : 'transparent',
                        cursor: 'pointer',
                      }}
                      onClick={() => toggleRecipe(recipe._id)}
                    >
                      <Form.Check
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRecipe(recipe._id)}
                        onClick={e => e.stopPropagation()}
                        className="me-2"
                      />
                      <div className="flex-grow-1 text-truncate">
                        <span className="fw-medium">{recipe.title}</span>
                        <div className="d-flex gap-1 mt-1">
                          {recipe.cookingAppliances?.map(app => {
                            const meta = getApplianceMeta(app);
                            return (
                              <OverlayTrigger
                                key={app}
                                placement="top"
                                overlay={<Tooltip>{meta.label}</Tooltip>}
                              >
                                <Badge
                                  pill
                                  style={{ backgroundColor: meta.color, fontSize: '0.65rem' }}
                                >
                                  {meta.icon}
                                </Badge>
                              </OverlayTrigger>
                            );
                          })}
                          {(!recipe.cookingAppliances || recipe.cookingAppliances.length === 0) && (
                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>No appliance set</small>
                          )}
                        </div>
                      </div>
                      {totalTime > 0 && (
                        <Badge bg="light" text="dark" className="ms-1" style={{ fontSize: '0.7rem' }}>
                          <Clock size={10} className="me-1" />
                          {formatTime(totalTime)}
                        </Badge>
                      )}
                    </div>
                  );
                })}
                {filteredRecipes.length === 0 && (
                  <p className="text-muted text-center mt-3">No recipes found</p>
                )}
              </SimpleBar>
              <div className="mt-2 text-muted">
                <small>{selectedRecipeIds.length} recipe(s) selected</small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* ── Right panel: analysis ── */}
        <Col lg={8}>
          {/* Overview stats */}
          <Card className="card-border mb-3">
            <Card.Body>
              <Row className="text-center">
                <Col md={4}>
                  <div>
                    <Clock size={20} className="text-primary mb-1" />
                    <h3 className="mb-0 text-primary">{formatTime(analysis.totalTime)}</h3>
                    <small className="text-muted">Total (parallel)</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <TrendingDown size={20} className="text-success mb-1" />
                    <h3 className="mb-0 text-success">{formatTime(analysis.parallelSavings)}</h3>
                    <small className="text-muted">Time saved</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div>
                    <Zap size={20} className="text-info mb-1" />
                    <h3 className="mb-0 text-info">{analysis.appliancesUsed}</h3>
                    <small className="text-muted">Appliances</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Appliance grouping */}
          <Card className="card-border mb-3">
            <Card.Header>
              <h6 className="mb-0">Recipes by Appliance</h6>
            </Card.Header>
            <Card.Body>
              {selectedRecipes.length === 0 ? (
                <p className="text-muted text-center mb-0">Select recipes to see grouping</p>
              ) : (
                Object.entries(analysis.byAppliance).map(([appValue, appRecipes]) => {
                  if (appRecipes.length === 0) return null;
                  const meta = getApplianceMeta(appValue);
                  return (
                    <div key={appValue} className="mb-3">
                      <div
                        className="d-flex align-items-center mb-2 p-2 rounded"
                        style={{ backgroundColor: meta.color + '22' }}
                      >
                        <span className="me-2 fs-5">{meta.icon}</span>
                        <strong>{meta.label}</strong>
                        <Badge bg="dark" className="ms-auto">{appRecipes.length}</Badge>
                      </div>
                      {appRecipes.map(recipe => (
                        <div
                          key={recipe._id}
                          className="d-flex justify-content-between align-items-center ps-4 py-1 border-bottom"
                        >
                          <span className="text-truncate" style={{ maxWidth: '65%' }}>
                            {recipe.title}
                          </span>
                          <small className="text-muted">
                            {formatTime((recipe.prepTime || 0) + (recipe.cookTime || 0))}
                          </small>
                        </div>
                      ))}
                    </div>
                  );
                })
              )}
            </Card.Body>
          </Card>

          {/* Timeline */}
          <Card className="card-border mb-3">
            <Card.Header>
              <h6 className="mb-0">Cooking Timeline</h6>
              <small className="text-muted">
                Parallel tracks = simultaneous cooking
              </small>
            </Card.Header>
            <Card.Body>
              {selectedRecipes.length === 0 ? (
                <p className="text-muted text-center mb-0">Select recipes to see timeline</p>
              ) : (
                <div>
                  {/* Time ruler */}
                  <div className="d-flex align-items-center mb-2" style={{ paddingLeft: '120px' }}>
                    {Array.from({ length: Math.ceil(maxTrackTime / 15) + 1 }, (_, i) => i * 15).map(min => (
                      <div
                        key={min}
                        className="text-muted"
                        style={{
                          position: 'absolute',
                          left: `calc(120px + ${(min / maxTrackTime) * 100}% * 0.85)`,
                          fontSize: '0.65rem',
                        }}
                      >
                        {formatTime(min)}
                      </div>
                    ))}
                  </div>

                  {/* Tracks */}
                  <div style={{ marginTop: '20px' }}>
                    {Object.entries(tracksByAppliance).map(([appValue, slots]) => {
                      const meta = getApplianceMeta(appValue);
                      return (
                        <div key={appValue} className="d-flex align-items-center mb-2">
                          {/* Appliance label */}
                          <div
                            className="text-end pe-2 flex-shrink-0"
                            style={{ width: '120px', fontSize: '0.8rem' }}
                          >
                            <span>{meta.icon} {meta.label}</span>
                          </div>
                          {/* Track bar */}
                          <div
                            className="position-relative flex-grow-1"
                            style={{
                              height: '36px',
                              backgroundColor: '#f5f5f5',
                              borderRadius: '4px',
                              overflow: 'hidden',
                            }}
                          >
                            {slots.map((slot, idx) => {
                              const leftPct = (slot.start / maxTrackTime) * 100;
                              const widthPct = (slot.duration / maxTrackTime) * 100;
                              return (
                                <OverlayTrigger
                                  key={`${slot.recipeId}-${idx}`}
                                  placement="top"
                                  overlay={
                                    <Tooltip>
                                      <strong>{slot.recipeName}</strong>
                                      <br />
                                      {formatTime(slot.duration)}
                                    </Tooltip>
                                  }
                                >
                                  <div
                                    style={{
                                      position: 'absolute',
                                      left: `${leftPct}%`,
                                      width: `${Math.max(widthPct, 2)}%`,
                                      height: '100%',
                                      backgroundColor: meta.color,
                                      borderRadius: '3px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      paddingLeft: '6px',
                                      overflow: 'hidden',
                                      whiteSpace: 'nowrap',
                                      border: '1px solid rgba(0,0,0,0.1)',
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: '0.7rem',
                                        color: '#fff',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                      }}
                                    >
                                      {slot.recipeName} ({formatTime(slot.duration)})
                                    </span>
                                  </div>
                                </OverlayTrigger>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  {analysis.sequentialTime > 0 && (
                    <div className="mt-3 p-2 bg-light rounded text-center">
                      <small className="text-muted">
                        Sequential: {formatTime(analysis.sequentialTime)} → Parallel: {formatTime(analysis.totalTime)}
                        {analysis.parallelSavings > 0 && (
                          <strong className="text-success ms-2">
                            ({formatTime(analysis.parallelSavings)} saved)
                          </strong>
                        )}
                      </small>
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CookingSessionPlanner;
