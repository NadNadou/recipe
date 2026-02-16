import React, { useEffect, useRef, useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import moment from 'moment';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPlans, updatePlanDate } from '../../redux/action/Plans';
import EventsDrawer from './EventsDrawer';
import { useWindowHeight } from '@react-hook/window-size';

const RecipeFullCalendar = ({ initialView = "dayGridMonth", filter, twoWeekView = false, enableEdit = false }) => {
  const calendarRef = useRef(null);
  const dispatch = useDispatch();

  const { plans } = useSelector(state => state.planReducer);
  const { mealTypes } = useSelector(state => state.metadataReducer);

  const [showEventInfo, setShowEventInfo] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [targetEvent, setTargetEvent] = useState(null);

  const getDefaultTime = (mealType) => {
    const match = mealTypes.find(
      m => m.label === mealType || m.value === mealType
    );
    return match?.defaultTime || '12:00';
  };

  /* ----------------------------
      1. Filter plans (memo)
  -----------------------------*/
  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
      if (filter === 'All') return true;
      if (filter === 'Meals') return ['Breakfast', 'Lunch', 'Dinner'].includes(plan.mealType);
      if (filter === 'Lunchbox') return plan.mealType === 'Lunchbox';
      if (filter === 'Babyfood') return plan.mealType === 'Babyfood';
      if (filter === 'Batch') return plan.isBatchCooked === true;
      return true;
    });
  }, [plans, filter]);

  /* ----------------------------
      2. Build Calendar Events
  -----------------------------*/
  const CalendarEvents = useMemo(() => {
    return filteredPlans.map(plan => {
      const recipe = plan.recipeId || {};

      const mealConfig = mealTypes.find(
        type => type.label?.toLowerCase() === plan.mealType?.toLowerCase()
      );

      const date = plan.date ? plan.date.split('T')[0] : '';
      const time = getDefaultTime(plan.mealType);

      return {
        title: `${plan.mealType} – ${recipe.title || "Recette"}`,
        start: `${date}T${time}`,
        backgroundColor: mealConfig?.backgroundColor || '#ccc',
        borderColor: mealConfig?.borderColor || '#ccc',
        extendedProps: {
          color: mealConfig?.backgroundColor || '#ccc',
          notes: plan.notes,
          mealType: plan.mealType,
          recipeId: recipe._id,
          recipeTitle: recipe.title || "Recette",
          recipeCookTime: recipe.cookTime || 0,
          recipePrepTime: recipe.prepTime || 0,
          recipeNutrition: recipe.nutrition || {},
          servings: recipe.servings || 0,
          isBatch: !!plan.parentPlanId,
          planId: plan._id,
          date: moment(plan.date).format("DD/MM/YYYY")
        }
      };
    })
  }, [filteredPlans, mealTypes]);

  /* ----------------------------
      3. Handle event move
  -----------------------------*/
  const handleEventDrop = async (info) => {
    const { event } = info;
    try {
      await dispatch(updatePlanDate(event.extendedProps.planId, event.start));
      await dispatch(getAllPlans());
    } catch (err) {
      console.error("Erreur déplacement :", err);
      info.revert();
    }
  };

  useEffect(() => {
    dispatch(getAllPlans());
  }, [dispatch]);


  /* ----------------------------
      4. Height & Date Range
  -----------------------------*/
  const calendarHeight = useWindowHeight() - 130;

  // Calculate valid range based on view mode (4 weeks for dashboard)
  const validRange = useMemo(() => {
    if (twoWeekView) {
      return {
        start: moment().format('YYYY-MM-DD'),
        end: moment().add(28, 'days').format('YYYY-MM-DD') // 4 weeks
      };
    }
    return {
      start: moment().startOf('month').format('YYYY-MM-DD'),
      end: moment().endOf('month').format('YYYY-MM-DD')
    };
  }, [twoWeekView]);

  // Use 4-week view if twoWeekView prop is true
  const effectiveInitialView = twoWeekView ? 'dayGridWeek' : initialView;

  /* ----------------------------
      5. Custom event content
  -----------------------------*/
  const renderEventContent = (arg) => {
    const mealType = arg.event.extendedProps.mealType;
    const typeInfo = mealTypes.find(m => m.label === mealType);
    const shortLabel = typeInfo?.short || '---';

    const color = arg.event.backgroundColor || '#999';

    const recipeTitle = arg.event.title.split("–")[1]?.trim() || "Recette";
    const shortTitle = recipeTitle.length > 22
      ? recipeTitle.slice(0, 20) + '…'
      : recipeTitle;

    return {
      html: `
        <div style="display:flex;align-items:center;font-size:0.8em;overflow:hidden;">
          <span style="background:${color};color:white;padding:2px 5px;border-radius:4px;margin-right:6px;font-weight:bold;">
            ${shortLabel}
          </span>
          <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            ${shortTitle}
          </span>
        </div>
      `
    };
  };

  return (
    <>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView={effectiveInitialView}
        initialDate={twoWeekView ? moment().format('YYYY-MM-DD') : undefined}
        headerToolbar={false}
        showNonCurrentDates={twoWeekView}
        themeSystem="bootstrap"
        height={calendarHeight}
        windowResizeDelay={400}
        droppable={true}
        editable={true}
        firstDay={1}
        validRange={validRange}
        views={twoWeekView ? {
          dayGridWeek: {
            type: 'dayGrid',
            duration: { weeks: 4 },
            buttonText: '4 weeks'
          }
        } : undefined}
        events={CalendarEvents}
        eventContent={renderEventContent}
        eventDrop={handleEventDrop}
        eventClick={(info) => {
          setTargetEvent(info.event);
          setEventTitle(info.event.title);
          setShowEventInfo(true);
        }}
      />

      <EventsDrawer
        show={showEventInfo}
        info={eventTitle}
        event={targetEvent}
        onClose={() => setShowEventInfo(false)}
        onUpdate={() => dispatch(getAllPlans())}
        toDisplay={enableEdit}
      />
    </>
  );
};

export default RecipeFullCalendar;