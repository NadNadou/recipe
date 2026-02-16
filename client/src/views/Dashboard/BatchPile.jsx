import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import { Plus, Trash2, Package, Minus } from 'react-feather';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import { getBatchSessions, createBatchSession, deleteBatchSession, consumeBatchPortion } from '../../redux/action/Plans';
import { getAllRecipes } from '../../redux/action/Recipes';

const BatchPile = ({ onAssignPortion }) => {
  const dispatch = useDispatch();
  const { batchSessions } = useSelector(state => state.planReducer);
  const { recipes } = useSelector(state => state.recipeReducer);
  const { mealTypes } = useSelector(state => state.metadataReducer);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState('');
  const [multiplier, setMultiplier] = useState(2);
  const [preparedDate, setPreparedDate] = useState(new Date());

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  useEffect(() => {
    dispatch(getBatchSessions());
    dispatch(getAllRecipes());
  }, [dispatch]);

  const handleCreateSession = async () => {
    if (!selectedRecipe) return;

    await dispatch(createBatchSession({
      recipeId: selectedRecipe,
      quantityMultiplier: multiplier,
      preparedDate,
    }));

    setShowCreateModal(false);
    setSelectedRecipe('');
    setMultiplier(2);
    dispatch(getBatchSessions());
  };

  const handleDeleteClick = (session) => {
    setSessionToDelete(session);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (sessionToDelete) {
      await dispatch(deleteBatchSession(sessionToDelete._id));
      dispatch(getBatchSessions());
    }
    setShowDeleteModal(false);
    setSessionToDelete(null);
  };

  const handleConsumePortion = async (sessionId) => {
    try {
      await dispatch(consumeBatchPortion(sessionId));
    } catch (error) {
      alert('No portions remaining');
    }
  };

  const selectedRecipeData = recipes?.find(r => r._id === selectedRecipe);

  return (
    <Card className="card-border h-100">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h6 className="mb-0">
          <Package size={16} className="me-2" />
          Batch Cooking Pile
        </h6>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={14} className="me-1" />
          New Batch
        </Button>
      </Card.Header>
      <Card.Body className="p-0">
        <SimpleBar style={{ maxHeight: '400px' }}>
          {batchSessions.length === 0 ? (
            <div className="text-center text-muted p-4">
              <Package size={32} className="mb-2 opacity-50" />
              <p className="mb-0">No batch cooking sessions</p>
              <small>Create a batch to prepare meals in advance</small>
            </div>
          ) : (
            <div className="p-3">
              {batchSessions.map(session => (
                <div
                  key={session._id}
                  className="batch-session-card mb-3 p-3 border rounded"
                  style={{ backgroundColor: '#f8f9fa' }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="mb-1">{session.recipeId?.title}</h6>
                      <small className="text-muted">
                        Prepared {moment(session.preparedDate).format('D MMM')} - x{session.quantityMultiplier}
                      </small>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteClick(session)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>

                  <div className="mb-2 d-flex align-items-center gap-2">
                    <Badge bg="info">
                      {session.remainingPortions} / {session.totalPortions} portions
                    </Badge>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Remove 1 portion (eaten without planning)</Tooltip>}
                    >
                      <Button
                        variant="outline-warning"
                        size="sm"
                        disabled={session.remainingPortions <= 0}
                        onClick={() => handleConsumePortion(session._id)}
                        style={{ padding: '2px 6px' }}
                      >
                        <Minus size={12} />
                      </Button>
                    </OverlayTrigger>
                  </div>

                  {/* Portion buttons to assign */}
                  <div className="d-flex flex-wrap gap-1">
                    {mealTypes.map(type => (
                      <OverlayTrigger
                        key={type.value}
                        placement="top"
                        overlay={<Tooltip>Assign as {type.label}</Tooltip>}
                      >
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          disabled={session.remainingPortions <= 0}
                          onClick={() => onAssignPortion && onAssignPortion(session, type.label)}
                          style={{
                            borderColor: type.backgroundColor,
                            color: type.backgroundColor,
                            fontSize: '0.7rem',
                            padding: '2px 8px'
                          }}
                        >
                          {type.short}
                        </Button>
                      </OverlayTrigger>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SimpleBar>
      </Card.Body>

      {/* Create Batch Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Batch Cooking Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Recipe</Form.Label>
              <Form.Select
                value={selectedRecipe}
                onChange={(e) => setSelectedRecipe(e.target.value)}
              >
                <option value="">-- Select a recipe --</option>
                {recipes?.map(r => (
                  <option key={r._id} value={r._id}>
                    {r.title} ({r.servings} servings)
                    {r.isBatchCookingDefault && ' [Batch optimized]'}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Multiplier</Form.Label>
              <Form.Select
                value={multiplier}
                onChange={(e) => setMultiplier(Number(e.target.value))}
                disabled={selectedRecipeData?.isBatchCookingDefault}
              >
                <option value={2}>x2 (double)</option>
                <option value={3}>x3 (triple)</option>
                <option value={4}>x4 (quadruple)</option>
              </Form.Select>
              {selectedRecipeData && (
                <Form.Text className="text-muted">
                  Total portions: {selectedRecipeData.servings * multiplier}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Preparation Date</Form.Label>
              <DatePicker
                selected={preparedDate}
                onChange={(date) => setPreparedDate(date)}
                dateFormat="dd/MM/yyyy"
                className="form-control"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateSession} disabled={!selectedRecipe}>
            Create Batch
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Batch Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {sessionToDelete && (
            <>
              <p>Are you sure you want to delete this batch session?</p>
              <p className="mb-0">
                <strong>{sessionToDelete.recipeId?.title}</strong>
                <br />
                <small className="text-muted">
                  {sessionToDelete.remainingPortions} / {sessionToDelete.totalPortions} portions remaining
                </small>
              </p>
              <p className="mt-3 mb-0 text-muted">
                <small>Already planned meals from this batch will be kept.</small>
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default BatchPile;
