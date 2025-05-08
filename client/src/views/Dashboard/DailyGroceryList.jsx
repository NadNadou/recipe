import React, {useEffect} from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import { MoreVertical } from 'react-feather';
import HkBadge from '../../components/@hk-badge/@hk-badge';
import ReturningCustomerChart from './ChartData/ReturningCustomerChart';
import { getWeeklyIngredientsByDay } from '../../redux/action/Stats';

import {useDispatch, useSelector } from 'react-redux';

const DailyGroceryList = () => {

    const dispatch = useDispatch();

    useEffect(() => {
    dispatch(getWeeklyIngredientsByDay())
    }, [])

    const rawData = useSelector(state => state.statsReducer.weeklyIngredients);

    const mergedIngredients = {};

    rawData.forEach(day => {
        day.ingredients.forEach(({ name, unit, quantity }) => {
          if (!mergedIngredients[name]) {
            mergedIngredients[name] = {};
          }
          if (!mergedIngredients[name][unit]) {
            mergedIngredients[name][unit] = 0;
          }
          mergedIngredients[name][unit] += quantity;
        });
      });
      
      // Transform into array for rendering
      const ingredientList = Object.entries(mergedIngredients).map(([name, unitsObj]) => ({
        name,
        units: Object.entries(unitsObj).map(([unit, quantity]) => ({ unit, quantity }))
      }));

    return (
        <Card className="card-border mb-0  h-100">
            <Card.Header className="card-header-action">
                <h6>Grocery list</h6>
                <div className="card-action-wrap">
                    <Dropdown className="inline-block" >
                        <Dropdown.Toggle variant='transparent' className="btn-icon btn-rounded btn-flush-dark flush-soft-hover no-caret" id="dropdown-basic1">
                            <span className="icon">
                                <span className="feather-icon">
                                    <MoreVertical />
                                </span>
                            </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end">
                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else here</Dropdown.Item>
                            <Dropdown.Divider as="div" />
                            <Dropdown.Item href="#/action-4">Separated link</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Card.Header>
            <Card.Body className="pt-0 text-start">
                {/* <h6 className="text-primary fw-bold mb-3">Weekly grocery list</h6> */}
                <ul className="list-unstyled ps-3 pt-4">
                    {ingredientList.length > 0 ? (
                    ingredientList.map((ing, i) => (
                        <li key={i} className="mb-2">
                        • {ing.name} –{" "}
                        {ing.units.map((u, idx) => (
                            <span key={idx}>
                            {u.quantity} {u.unit}{idx < ing.units.length - 1 ? ", " : ""}
                            </span>
                        ))}
                        </li>
                    ))
                    ) : (
                    <li className="text-muted">No ingredients planned this week.</li>
                    )}
                </ul>
            </Card.Body>

        </Card>
    )
}

export default DailyGroceryList
