/* eslint-disable no-useless-concat */
import React, { createRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup } from 'react-bootstrap';
import classNames from 'classnames';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from "@fullcalendar/interaction";
import moment from 'moment';
import { useWindowHeight } from '@react-hook/window-size';
import CalendarSidebar from './CalendarSidebar';
import EventsDrawer from './EventsDrawer';
import CreateNewEvent from './CreateNewRecipe';
import 'bootstrap-icons/font/bootstrap-icons.css';
//Redux
import { connect } from 'react-redux';
import { toggleTopNav } from '../../redux/action/Theme';
//Icons
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChevronDown, ChevronUp } from 'react-feather';

import { getAllPlans,updatePlanDate } from '../../redux/action/Plans';

const Calendar = ({ topNavCollapsed, toggleTopNav }) => {
    const dispatch = useDispatch();
    
    const {plans} = useSelector(state => state.planReducer);
    const { mealTypes } = useSelector((state) => state.metadataReducer);

    const getDefaultTime = (mealType) => {
        const match = mealTypes.find(m => m.label === mealType || m.value === mealType);
        return match?.defaultTime || '12:00';
      };

    const CalendarEvents = plans.map((plan) => {
        const recipeTitle = plan.recipeId?.title || "Recette";
        const recipePrepTime = plan.recipeId?.prepTime|| 0;
        const recipeCookTime = plan.recipeId?.cookTime|| 0;
        const recipeNutrition = plan.recipeId?.nutrition|| {};
        const recipeServings = plan.recipeId?.servings|| 1;
        const planServings = plan.servings || 1;

        // Calculate calories for this meal (per portion * plan servings)
        const mealCalories = Math.round((recipeNutrition?.caloriesPerPortion || 0) * planServings);

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
            // Per 100g values for nutrition display
            recipeCal100g: recipeNutrition?.caloriesPer100g || 0,
            recipeProt100g: recipeNutrition?.proteinsPer100g || 0,
            recipeCarbs100g: recipeNutrition?.carbsPer100g || 0,
            recipeFats100g: recipeNutrition?.fatsPer100g || 0,
            // Total calories for this meal
            mealCalories: mealCalories,
            recipeCookTime:recipeCookTime,
            recipePrepTime:recipePrepTime,
            planId: plan._id,
            recipeTitle: recipeTitle,
            recipeServings: recipeServings,
            planServings: planServings,
            isBatch: plan.isBatchCooked || false,
            date: moment(plan.date).format("DD/MM/YYYY"),
          }
        };
      });

    let calendarRef = createRef()
    var curYear = moment().format('YYYY'),
        curMonth = moment().format('MM');

    const [showSidebar, setShowSidebar] = useState(true)
    const [showEventInfo, setShowEventInfo] = useState(false);
    const [createEvent, setCreateEvent] = useState(false);
    const [eventTitle, setEventTitle] = useState();
    const [targetEvent, setTargetEvent] = useState();
    const [date, setDate] = useState(curYear + '-' + curMonth + '-07');
    const [currentView, setCurrentView] = useState("month");

    useEffect(() => {
        const calApi = calendarRef.current.getApi();

        if (calApi) {
            setDate(moment(calApi.getDate()));
        }
    }, []);
    // }, [calendarRef]);

    useEffect( () => {
        dispatch(getAllPlans())
    },[])


    //Function for date change
    const handleChange = (action) => {
        let calendarApi = calendarRef.current.getApi();
        if (calendarApi) {
            if (action === 'prev') {
                calendarApi.prev();
            }
            else if (action === 'next') {
                calendarApi.next();
            }
            else {
                calendarApi.today();
            }

            setDate(moment(calendarApi.getDate()));
        }
    }

    //Function for Calendar View Changes
    const handleView = (view) => {
        let calendarApi = calendarRef.current.getApi();
        if (calendarApi) {
            if (view === 'week') {
                calendarApi.changeView("timeGridWeek");
            }
            else if (view === 'day') {
                calendarApi.changeView("timeGridDay");
            }
            else if (view === 'list') {
                calendarApi.changeView("listWeek");
            }
            else {
                calendarApi.changeView("dayGridMonth");
            }

            setDate(moment(calendarApi.getDate()));
            setCurrentView(view);
        }
    }

    const handleEventDrop = async (info) => {
        const { event } = info;
        const planId = event.extendedProps.planId;
        const newDate = event.start;
      
        try {
          await dispatch(updatePlanDate(planId, newDate));
      
          // ⬇️ Rafraîchit la liste complète des plans (ou juste celui modifié si tu as une action dédiée)
          await dispatch(getAllPlans());
      
          // ✅ Optionnel : notification utilisateur
          console.log(`Plan mis à jour pour le ${moment(newDate).format("DD/MM/YYYY")}`);
        } catch (err) {
          console.error("Erreur lors du déplacement du plan :", err);
          info.revert(); // Remet l’événement à sa place initiale
        }
      };
      
      

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar)
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 500);
    }
    const Calender_height = useWindowHeight();

    return (
        <>
            <div className="hk-pg-body py-0">
                <div className={classNames("calendarapp-wrap", { "calendarapp-sidebar-toggle": !showSidebar })} >
                    <CalendarSidebar showSidebar={showSidebar} toggleSidebar={() => setShowSidebar(!showSidebar)} createNewEvent={() => setCreateEvent(!createEvent)} />
                    <div className="calendarapp-content">
                        <div id="calendar" className="w-100">

                            <header className="cd-header">
                                <div className="d-flex flex-1 justify-content-start">
                                    <Button variant="outline-light me-3" onClick={() => handleChange("today")} >Today</Button>
                                    <Button variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover" onClick={() => handleChange("prev")} >
                                        <span className="icon">
                                            <FontAwesomeIcon icon={faChevronLeft} size="sm" />
                                        </span>
                                    </Button>
                                    <Button variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover" onClick={() => handleChange("next")} >
                                        <span className="icon">
                                            <FontAwesomeIcon icon={faChevronRight} size="sm" />
                                        </span>
                                    </Button>
                                </div>
                                <div className="d-flex flex-1 justify-content-center">
                                    <h4 className="mb-0">{moment(date).format('MMMM' + ' ' + 'YYYY')}</h4>
                                </div>
                                <div className="cd-options-wrap d-flex flex-1 justify-content-end">
                                    <ButtonGroup className="d-none d-md-flex">
                                        <Button variant="outline-light" onClick={() => handleView("month")} active={currentView === "dayGridMonth"} >month</Button>
                                        <Button variant="outline-light" onClick={() => handleView("week")} active={currentView === "timeGridWeek"}>week</Button>
                                        <Button variant="outline-light" onClick={() => handleView("day")} active={currentView === "timeGridDay"}>day</Button>
                                        <Button variant="outline-light" onClick={() => handleView("list")} active={currentView === "listWeek"}>list</Button>
                                    </ButtonGroup>
                                    <Button as="a" variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover hk-navbar-togglable" onClick={() => toggleTopNav(!topNavCollapsed)} >
                                        <span className="icon">
                                            <span className="feather-icon">
                                                {
                                                    topNavCollapsed ? <ChevronDown /> : <ChevronUp />
                                                }
                                            </span>
                                        </span>
                                    </Button>
                                </div>

                                <div className={classNames("hk-sidebar-togglable", { "active": !showSidebar })} onClick={toggleSidebar} />
                            </header>

                            <FullCalendar
                                ref={calendarRef}
                                plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                initialDate={date}
                                headerToolbar={false}
                                themeSystem='bootstrap'
                                height={Calender_height - 130}
                                windowResizeDelay={500}
                                droppable={true}
                                editable={true}
                                firstDay={1}
                                events={CalendarEvents}
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
                                  
                                  
                                  
                                eventDrop={handleEventDrop}

                                eventClick={function (info) {
                                    setTargetEvent(info.event);
                                    setEventTitle(info.event._def.title);
                                    setShowEventInfo(true);
                                }
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Info */}
            <EventsDrawer show={showEventInfo} info={eventTitle} event={targetEvent} onClose={() => setShowEventInfo(!showEventInfo)} onUpdate={() => dispatch(getAllPlans()) } toDisplay={true}  />

            {/* New Event */}
            <CreateNewEvent calendarRef={calendarRef} show={createEvent} hide={() => setCreateEvent(!createEvent)} />
        </>

    )
}

const mapStateToProps = ({ theme }) => {
    const { topNavCollapsed } = theme;
    return { topNavCollapsed }
};

export default connect(mapStateToProps, { toggleTopNav })(Calendar);