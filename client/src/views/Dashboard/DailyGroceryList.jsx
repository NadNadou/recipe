import React, { useEffect, useState, useMemo } from 'react';
import { Card, Form, Spinner, Button, ButtonGroup } from 'react-bootstrap';
import { ShoppingCart, Check, RefreshCw, ChevronLeft, ChevronRight } from 'react-feather';
import SimpleBar from 'simplebar-react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getGroceryList } from '../../redux/action/Stats';

const DailyGroceryList = () => {
    const dispatch = useDispatch();

    // State for checked items (stored locally)
    const [checkedItems, setCheckedItems] = useState(() => {
        const saved = localStorage.getItem('groceryCheckedItems');
        return saved ? JSON.parse(saved) : {};
    });

    // Week offset (0 = this week, 1 = next week, etc.)
    const [weekOffset, setWeekOffset] = useState(0);

    const { groceryList, groceryLoading } = useSelector(state => state.statsReducer);
    const { plans } = useSelector(state => state.planReducer);
    const { batchSessions } = useSelector(state => state.planReducer);

    // Calculate date range based on week offset (ISO week: Monday to Sunday)
    const dateParams = useMemo(() => {
        const targetWeek = moment().add(weekOffset, 'weeks');
        const start = targetWeek.clone().startOf('isoWeek').format('YYYY-MM-DD');
        const end = targetWeek.clone().endOf('isoWeek').format('YYYY-MM-DD');
        return { start, end };
    }, [weekOffset]);

    // Get week label for display
    const weekLabel = useMemo(() => {
        const startDate = moment(dateParams.start);
        const endDate = moment(dateParams.end);
        if (weekOffset === 0) {
            return `This week (${startDate.format('D MMM')} - ${endDate.format('D MMM')})`;
        } else if (weekOffset === 1) {
            return `Next week (${startDate.format('D MMM')} - ${endDate.format('D MMM')})`;
        }
        return `Week ${startDate.format('D MMM')} - ${endDate.format('D MMM')}`;
    }, [dateParams, weekOffset]);

    // Refetch when plans or batch sessions change
    const plansLength = plans?.length || 0;
    const batchSessionsLength = batchSessions?.length || 0;

    useEffect(() => {
        dispatch(getGroceryList(dateParams.start, dateParams.end));
    }, [dispatch, dateParams, plansLength, batchSessionsLength]);

    // Save checked items to localStorage
    useEffect(() => {
        localStorage.setItem('groceryCheckedItems', JSON.stringify(checkedItems));
    }, [checkedItems]);

    const handleToggleItem = (itemId) => {
        setCheckedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleClearChecked = () => {
        setCheckedItems({});
    };

    const handleRefresh = () => {
        dispatch(getGroceryList(dateParams.start, dateParams.end));
    };

    // Separate checked and unchecked items
    const { uncheckedItems, checkedItemsList } = useMemo(() => {
        const ingredients = groceryList?.ingredients || [];
        const unchecked = ingredients.filter(ing => !checkedItems[ing.id]);
        const checked = ingredients.filter(ing => checkedItems[ing.id]);
        return { uncheckedItems: unchecked, checkedItemsList: checked };
    }, [groceryList, checkedItems]);

    const totalItems = (groceryList?.ingredients || []).length;
    const checkedCount = checkedItemsList.length;

    return (
        <Card className="card-border mb-0 h-100">
            <Card.Header className="card-header-action">
                <div className="d-flex align-items-center">
                    <ShoppingCart size={18} className="me-2 text-primary" />
                    <h6 className="mb-0">Grocery List</h6>
                </div>
                <div className="card-action-wrap d-flex align-items-center gap-2">
                    <Button
                        variant="flush-secondary"
                        size="sm"
                        className="btn-icon btn-rounded flush-soft-hover"
                        onClick={handleRefresh}
                        disabled={groceryLoading}
                    >
                        <RefreshCw size={16} className={groceryLoading ? 'spin' : ''} />
                    </Button>
                </div>
            </Card.Header>

            <Card.Body className="pt-2">
                {/* Week selector */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))}
                        disabled={weekOffset === 0}
                    >
                        <ChevronLeft size={16} />
                    </Button>
                    <div className="text-center flex-grow-1 mx-2">
                        <small className="fw-medium">{weekLabel}</small>
                    </div>
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setWeekOffset(prev => Math.min(3, prev + 1))}
                        disabled={weekOffset >= 3}
                    >
                        <ChevronRight size={16} />
                    </Button>
                </div>

                {/* Quick week buttons */}
                <ButtonGroup size="sm" className="w-100 mb-3">
                    <Button
                        variant={weekOffset === 0 ? 'primary' : 'outline-secondary'}
                        onClick={() => setWeekOffset(0)}
                    >
                        This week
                    </Button>
                    <Button
                        variant={weekOffset === 1 ? 'primary' : 'outline-secondary'}
                        onClick={() => setWeekOffset(1)}
                    >
                        Next week
                    </Button>
                </ButtonGroup>

                {/* Progress indicator */}
                {totalItems > 0 && (
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted">
                            {checkedCount} / {totalItems} items
                        </small>
                        {checkedCount > 0 && (
                            <Button
                                variant="link"
                                size="sm"
                                className="p-0 text-muted"
                                onClick={handleClearChecked}
                            >
                                Clear all
                            </Button>
                        )}
                    </div>
                )}

                {/* Progress bar */}
                {totalItems > 0 && (
                    <div className="progress mb-3" style={{ height: '4px' }}>
                        <div
                            className="progress-bar bg-success"
                            style={{ width: `${(checkedCount / totalItems) * 100}%` }}
                        />
                    </div>
                )}

                {groceryLoading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" size="sm" className="text-primary" />
                        <p className="text-muted mt-2 mb-0">Loading...</p>
                    </div>
                ) : (
                    <SimpleBar style={{ maxHeight: '350px' }}>
                        {/* Unchecked items */}
                        {uncheckedItems.length > 0 ? (
                            <ul className="list-unstyled mb-0">
                                {uncheckedItems.map((ing) => (
                                    <li
                                        key={ing.id}
                                        className="d-flex align-items-center py-2 border-bottom"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleToggleItem(ing.id)}
                                    >
                                        <Form.Check
                                            type="checkbox"
                                            checked={false}
                                            onChange={() => handleToggleItem(ing.id)}
                                            className="me-2"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <span className="flex-grow-1">{ing.name}</span>
                                        <span className="text-muted fw-medium">
                                            {ing.quantity} {ing.unit}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : checkedItemsList.length === 0 ? (
                            <p className="text-muted text-center py-3 mb-0">
                                No ingredients planned for this period.
                            </p>
                        ) : null}

                        {/* Checked items (at the bottom, with different style) */}
                        {checkedItemsList.length > 0 && (
                            <>
                                {uncheckedItems.length > 0 && (
                                    <div className="d-flex align-items-center my-2">
                                        <hr className="flex-grow-1" />
                                        <small className="text-muted mx-2">
                                            <Check size={12} className="me-1" />
                                            Already have
                                        </small>
                                        <hr className="flex-grow-1" />
                                    </div>
                                )}
                                <ul className="list-unstyled mb-0">
                                    {checkedItemsList.map((ing) => (
                                        <li
                                            key={ing.id}
                                            className="d-flex align-items-center py-2 border-bottom"
                                            style={{ cursor: 'pointer', opacity: 0.6 }}
                                            onClick={() => handleToggleItem(ing.id)}
                                        >
                                            <Form.Check
                                                type="checkbox"
                                                checked={true}
                                                onChange={() => handleToggleItem(ing.id)}
                                                className="me-2"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <span className="flex-grow-1 text-decoration-line-through">
                                                {ing.name}
                                            </span>
                                            <span className="text-muted fw-medium text-decoration-line-through">
                                                {ing.quantity} {ing.unit}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </SimpleBar>
                )}

                {/* Source counts */}
                {!groceryLoading && (groceryList?.nonBatchMeals > 0 || groceryList?.batchSessions > 0) && (
                    <div className="mt-3 pt-2 border-top">
                        <small className="text-muted d-block">
                            {groceryList.nonBatchMeals > 0 && (
                                <span>{groceryList.nonBatchMeals} regular meal{groceryList.nonBatchMeals > 1 ? 's' : ''}</span>
                            )}
                            {groceryList.nonBatchMeals > 0 && groceryList.batchSessions > 0 && ' + '}
                            {groceryList.batchSessions > 0 && (
                                <span>{groceryList.batchSessions} batch session{groceryList.batchSessions > 1 ? 's' : ''}</span>
                            )}
                        </small>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default DailyGroceryList;
