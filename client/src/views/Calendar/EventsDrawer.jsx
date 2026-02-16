import React, { useState, useEffect } from 'react';
import SimpleBar from 'simplebar-react';
import { OverlayTrigger,Tooltip,Button, Form } from 'react-bootstrap';
import classNames from 'classnames';
import moment from 'moment';
import Swal from 'sweetalert2';
import * as Icons from 'react-feather';
import '@sweetalert2/theme-bootstrap-4/bootstrap-4.css';
import 'animate.css';

import HkBadge from '../../components/@hk-badge/@hk-badge';
import { useDispatch, useSelector } from 'react-redux';
import { deletePlan, updatePlan } from '../../redux/action/Plans';

const EventsDrawer = ({ show, onClose, event, onUpdate, toDisplay }) => {
  const dispatch = useDispatch();
  const { mealTypes } = useSelector(state => state.metadataReducer);

  const [editable, setEditable] = useState(false);
  const [eventColor, setEventColor] = useState("#009B84");
  const [editableMealType, setEditableMealType] = useState("Lunch");
  const [editableNotes, setEditableNotes] = useState("");
  const [editableDate, setEditableDate] = useState("");

  useEffect(() => {
    if (event?.extendedProps) {
      const {
        mealType,
        notes,
        date,
        color,
      } = event.extendedProps;

      setEditableMealType(mealType || "Lunch");
      setEditableNotes(notes || "");
      setEditableDate(moment(date, "DD/MM/YYYY").format("YYYY-MM-DD"));
      setEventColor(color || "#009B84");
    }
  }, [event]);

  if (!event) return null;

  const {
    // Per 100g macros
    recipeCal100g,
    recipeProt100g,
    recipeCarbs100g,
    recipeFats100g,
    // Meal total calories
    mealCalories,
    recipeCookTime,
    recipePrepTime,
    planId,
    recipeTitle,
    date,
    notes,
    mealType,
    recipeServings,
    planServings,
    isBatch
  } = event.extendedProps || {};

  const handleClose = () => {
    if (editable) {
      setEditable(false);
    } else {
      onClose();
    }
  };

  const DeletEvent = () => {
    Swal.fire({
      html: '<div class="mb-3"><i class="ri-delete-bin-6-line fs-5 text-danger"></i></div><h5 class="text-danger">Delete this plan?</h5><p>This action cannot be undone.</p>',
      customClass: {
        confirmButton: 'btn btn-outline-secondary text-danger',
        cancelButton: 'btn btn-outline-secondary text-grey',
        container: 'swal2-has-bg'
      },
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
      showClass: { popup: 'animate__animated animate__fadeInDown' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deletePlan(planId));
        onClose();
        Swal.fire({
          html: '<div class="d-flex align-items-center"><i class="ri-delete-bin-5-fill me-2 fs-3 text-danger"></i><h5 class="text-danger mb-0">Plan deleted!</h5></div>',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div className={classNames("hk-drawer calendar-drawer drawer-right", { "drawer-toggle": show })}>
      {/* VIEW MODE */}
      <div className={classNames({ "d-none": editable })}>
       <div className="drawer-header">
          <div className="drawer-header-action">
            {toDisplay &&  <Button 
                size="sm" 
                variant="flush-secondary" 
                className="btn-icon btn-rounded flush-soft-hover"          
                onClick={() => setEditable(true)}
            >
              <Icons.Edit2 />
            </Button>}

             {toDisplay && <OverlayTrigger
                placement="bottom"
                overlay={
                    <Tooltip>
                    {event?.extendedProps?.isBatch
                        ? "Ce plan est automatique et ne peut être supprimé."
                        : "Supprimer ce plan"}
                    </Tooltip>
                }
            >
            <span className="d-inline-block">
                <Button 
                size="sm" 
                variant="flush-secondary" 
                className="btn-icon btn-rounded flush-soft-hover" 
                onClick={DeletEvent}
                disabled={event?.extendedProps?.isBatch}
                style={event?.extendedProps?.isBatch ? { pointerEvents: 'none' } : {}}
                >
                <Icons.Trash2 />
                </Button>
            </span>
            </OverlayTrigger>}

            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id={`tooltip-recipe-link`}>
                  View full recipe
                </Tooltip>
              }
            >
              <Button 
                size="sm" 
                variant="flush-secondary" 
                className="btn-icon btn-rounded flush-soft-hover lp-4"
                onClick={() => window.open(`/apps/recipe/detail/${event.extendedProps.recipeId}`, '_blank')}
              >
                <Icons.ExternalLink />
              </Button>
            </OverlayTrigger>


            <Button bsPrefix="btn-close" className="drawer-close" onClick={onClose}>
              <span aria-hidden="true">×</span>
            </Button>
          </div>
        </div>
        <div className="drawer-body">
          <SimpleBar className="nicescroll-bar">
            <div className="drawer-content-wrap">
              <div className="event-head mb-4">
                <HkBadge style={{ backgroundColor: eventColor }} indicator className="badge-indicator-xl flex-shrink-0 me-2" />
                <div>
                  <div className="event-name">{recipeTitle || "Recette"}</div>
                  <span>{mealType}</span>
                </div>


              </div>
              <ul className="event-detail">
                <li>
                  <span className="ev-icon-wrap"><Icons.Calendar /></span>
                  {date}
                </li>
                {planServings && (
                <li>
                    <span className="ev-icon-wrap"><Icons.Users /></span>
                    Servings: {planServings} {planServings > 1 ? 'portions' : 'portion'}
                </li>
                )}

                {mealType !== "Babyfood" && mealCalories > 0 && (
                <li>
                    <span className="ev-icon-wrap"><Icons.Zap /></span>
                    <strong>🔥 {mealCalories} kcal</strong> for this meal
                </li>
                )}

                {mealType !== "Babyfood" && (recipeProt100g > 0 || recipeCarbs100g > 0 || recipeFats100g > 0) && (
                <li>
                    <span className="ev-icon-wrap"><Icons.Activity /></span>
                    <div>
                    <strong>Macros per 100g:</strong><br />
                    🥩 {Math.round(recipeProt100g) || 0}g proteins<br />
                    🍞 {Math.round(recipeCarbs100g) || 0}g carbs<br />
                    🧈 {Math.round(recipeFats100g) || 0}g fat<br />
                    🔥 {Math.round(recipeCal100g) || 0} kcal
                    </div>
                </li>
                )}

                {recipePrepTime && (
                  <li>
                    <span className="ev-icon-wrap"><Icons.Tool /></span>
                    Preparation time : {recipePrepTime} min
                  </li>
                )}
                {recipeCookTime && (
                  <li>
                    <span className="ev-icon-wrap"><Icons.Clock /></span>
                    Cooking time : {recipeCookTime} min
                  </li>
                )}
                {notes && (
                  <li>
                    <span className="ev-icon-wrap"><Icons.Menu /></span>
                    {notes}
                  </li>
                )}
              </ul>
            </div>
          </SimpleBar>
        </div>
      </div>

      {/* EDIT MODE */}
      <div className={classNames({ "d-none": !editable })}>
        <div className="drawer-header">
          <div className="drawer-header-action">
            <Button size="sm" variant="flush-secondary" className="btn-icon btn-rounded flush-soft-hover me-2">
              <Icons.ExternalLink />
            </Button>
            <Button bsPrefix="btn-close" className="drawer-close" onClick={handleClose}>
              <span aria-hidden="true">×</span>
            </Button>
          </div>
        </div>
        <div className="drawer-body">
          <SimpleBar className="nicescroll-bar">
            <div className="drawer-content-wrap">
              <Form.Group className="mt-3">
                <Form.Label>Meal type</Form.Label>
                <Form.Select value={editableMealType} onChange={(e) => setEditableMealType(e.target.value)}>
                  {mealTypes.map(type => (
                    <option key={type.value} value={type.label}>
                      {type.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  disabled={isBatch}
                  value={editableNotes}
                  onChange={(e) => setEditableNotes(e.target.value)}
                  placeholder="Add notes..."
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={editableDate}
                  min={moment().format('YYYY-MM-DD')}
                  onChange={(e) => setEditableDate(e.target.value)}
                />
              </Form.Group>
            </div>
          </SimpleBar>
        </div>
        <div className="drawer-footer d-flex justify-content-end">
          <Button variant="secondary" className="drawer-edit-close me-2" onClick={() => setEditable(false)}>Cancel</Button>
          <Button
            variant="primary"
            className="drawer-edit-close"
            onClick={() => {
                dispatch(updatePlan(planId, {
                  mealType: editableMealType,
                  date: editableDate,
                  notes: editableNotes,
                })).then(() => {
                  if (onUpdate) onUpdate();
                  setEditable(false);
                  onClose();
                  Swal.fire({
                    icon: 'success',
                    title: 'Updated',
                    text: 'The plan has been updated.',
                    timer: 1500,
                    showConfirmButton: false,
                  });
                });
              }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventsDrawer;
