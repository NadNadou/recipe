import React, { useRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import moment from 'moment';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from "@fullcalendar/interaction";
import { useDispatch, useSelector } from 'react-redux';
import { getAllPlans, updatePlanDate } from '../../redux/action/Plans';
import EventsDrawer from './EventsDrawer';
import CreateNewRecipe from './CreateNewRecipe';

const RecipeFullCalendar = ({ initialView = "dayGridMonth", height = 500,filter}) => {
  const calendarRef = useRef(null);
  const dispatch = useDispatch();
  
  const {plans} = useSelector(state => state.planReducer);
  const { mealTypes } = useSelector((state) => state.metadataReducer);


  const [showEventInfo, setShowEventInfo] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [targetEvent, setTargetEvent] = useState(null);
  const [createEvent, setCreateEvent] = useState(false);

  const getDefaultTime = (mealType) => {
    const match = mealTypes.find(m => m.label === mealType || m.value === mealType);
    return match?.defaultTime || '12:00';
  };

  const filteredPlans = plans.filter(plan => {
    if (filter === 'All') return true;
    if (filter === 'Babyfood') return plan.mealType === 'Babyfood';
    if (filter === 'Snack') return plan.mealType === 'Snack';
    if (filter === 'Lunch / diner') return ['Déjeuner', 'Dîner', 'Lunch', 'Dinner'].includes(plan.mealType);
    return true;
  });

    const CalendarEvents = filteredPlans.map((plan) => {
        const recipeTitle = plan.recipeId?.title || "Recette";
        const recipePrepTime = plan.recipeId?.prepTime|| 0;
        const recipeCookTime = plan.recipeId?.cookTime|| 0;
        const recipeNutrition = plan.recipeId?.nutrition|| {};
        const recipeServings = plan.recipeId?.servings|| 0;

        const date = plan.date ? plan.date.split('T')[0] : '';
        const time = getDefaultTime(plan.mealType);

        const mealConfig = mealTypes.find(type => type.label.toLowerCase() === plan.mealType.toLowerCase());
        return {
            title: `${plan.mealType} – ${recipeTitle}`,
          start: `${date}T${time}`,
          backgroundColor: mealConfig?.backgroundColor || '#ccc',
          borderColor: mealConfig?.borderColor || '#ccc',
          extendedProps: {
            color:mealConfig?.backgroundColor || '#ccc',
            notes: plan.notes,
            mealType: plan.mealType,
            recipeId: plan.recipeId?._id,
            recipeCal:recipeNutrition?.calories,
            recipeProt:recipeNutrition?.proteins,
            recipeCarbs:recipeNutrition?.carbs,
            recipeFats:recipeNutrition?.fats,
            recipeCookTime:recipeCookTime,
            recipePrepTime:recipePrepTime,
            planId: plan._id,
            recipeTitle: recipeTitle,
            servings:recipeServings,
            isBatch:!!plan.parentPlanId,
            date: moment(plan.date).format("DD/MM/YYYY"),
          }
        };
      });

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



  return (
    <>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView={initialView}
        firstDay={1}
        events={CalendarEvents}
        editable={true}
        height={height}
        eventDrop={handleEventDrop}
        eventContent={function (arg) {
          const mealShort = arg.event.extendedProps.mealType;
          const shortLabel = mealTypes.find(m => m.label === mealShort)?.short || '---';
          const color = arg.event.backgroundColor || '#999';
        
          const recipeTitle = arg.event.title.split("–")[1]?.trim() || "Recipe";
          const shortTitle = recipeTitle.length > 20 ? recipeTitle.slice(0, 17) + '...' : recipeTitle;
        
          return {
            html: `
              <div style="display: flex; align-items: center; font-size: 0.85em; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                <span style="width: 8px; height: 8px; background-color: ${color}; border-radius: 50%; margin-right: 5px;"></span>
                <strong>[${shortLabel}]</strong>&nbsp;${shortTitle}
              </div>
            `
          };
        }}
        
        eventClick={(info) => {
          setTargetEvent(info.event);
          setEventTitle(info.event._def.title);
          setShowEventInfo(true);
        }}
        headerToolbar={false}
      />

      <EventsDrawer
        show={showEventInfo}
        info={eventTitle}
        event={targetEvent}
        onClose={() => setShowEventInfo(false)}
        onUpdate={() => dispatch(getAllPlans())}
      />

      <CreateNewRecipe calendarRef={calendarRef} show={createEvent} hide={() => setCreateEvent(false)} />
    </>
  );
};

export default RecipeFullCalendar;
