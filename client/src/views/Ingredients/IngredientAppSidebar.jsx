import React, { useState, useMemo } from 'react';
import { Button, Nav, Form, Badge } from 'react-bootstrap';
import { Plus, AlertTriangle, Package } from 'react-feather';
import SimpleBar from 'simplebar-react';
import { useSelector } from 'react-redux';
import CreateNewIngredient from './CreateNewIngredient';

const IngredientAppSidebar = ({
    activeCategory,
    onCategoryChange,
    showMissingNutrition,
    onToggleMissingNutrition,
    showUnused,
    onToggleUnused,
    ingredients = [],
}) => {
    const [addNewContact, setAddNewContact] = useState(false);
    const ingredientCategories = useSelector(state => state.metadataReducer.ingredientCategories);

    const stats = useMemo(() => {
        const total = ingredients.length;
        const missingNutrition = ingredients.filter(
            ing => !ing.nutritionPer100g || ing.nutritionPer100g.calories === 0
        ).length;
        const unused = ingredients.filter(
            ing => !ing.usedInRecipes || ing.usedInRecipes.length === 0
        ).length;

        const byCategory = {};
        ingredientCategories.forEach(cat => { byCategory[cat.value] = 0; });
        ingredients.forEach(ing => {
            const cat = ing.category || 'other';
            byCategory[cat] = (byCategory[cat] || 0) + 1;
        });

        return { total, missingNutrition, unused, byCategory };
    }, [ingredients, ingredientCategories]);

    return (
        <>
            <Nav className="contactapp-sidebar">
                <SimpleBar className="nicescroll-bar">
                    <div className="menu-content-wrap">
                        <Button
                            variant="primary"
                            className="btn-rounded btn-block mb-4"
                            onClick={() => setAddNewContact(true)}
                        >
                            Add new ingredient
                        </Button>

                        {/* Categories */}
                        <div className="menu-group">
                            <div className="title-sm text-primary mb-2">Categories</div>
                            <Nav className="nav-light navbar-nav flex-column">
                                <Nav.Item>
                                    <Nav.Link
                                        active={activeCategory === 'all'}
                                        onClick={() => onCategoryChange('all')}
                                        className="d-flex justify-content-between align-items-center"
                                    >
                                        <span className="nav-link-text">All</span>
                                        <Badge bg="light" text="dark" pill className="ms-auto">
                                            {stats.total}
                                        </Badge>
                                    </Nav.Link>
                                </Nav.Item>
                                {ingredientCategories.map(cat => (
                                    stats.byCategory[cat.value] > 0 && (
                                        <Nav.Item key={cat.value}>
                                            <Nav.Link
                                                active={activeCategory === cat.value}
                                                onClick={() => onCategoryChange(cat.value)}
                                                className="d-flex justify-content-between align-items-center"
                                            >
                                                <span className="nav-link-text">
                                                    {cat.icon} {cat.label}
                                                </span>
                                                <Badge bg="light" text="dark" pill className="ms-auto">
                                                    {stats.byCategory[cat.value]}
                                                </Badge>
                                            </Nav.Link>
                                        </Nav.Item>
                                    )
                                ))}
                            </Nav>
                        </div>

                        <div className="separator separator-light" />

                        {/* Quick Filters */}
                        <div className="menu-group">
                            <div className="title-sm text-primary mb-2">Quick Filters</div>
                            <Form.Check
                                type="switch"
                                id="filter-missing-nutrition"
                                label={
                                    <span className="d-flex align-items-center gap-1">
                                        <AlertTriangle size={14} className="text-warning" />
                                        Missing nutrition
                                        <Badge bg="warning" text="dark" pill className="ms-auto">
                                            {stats.missingNutrition}
                                        </Badge>
                                    </span>
                                }
                                checked={showMissingNutrition}
                                onChange={onToggleMissingNutrition}
                                className="mb-2"
                            />
                            <Form.Check
                                type="switch"
                                id="filter-unused"
                                label={
                                    <span className="d-flex align-items-center gap-1">
                                        <Package size={14} className="text-muted" />
                                        Unused
                                        <Badge bg="secondary" pill className="ms-auto">
                                            {stats.unused}
                                        </Badge>
                                    </span>
                                }
                                checked={showUnused}
                                onChange={onToggleUnused}
                                className="mb-2"
                            />
                        </div>

                        <div className="separator separator-light" />

                        {/* Stats */}
                        <div className="menu-group">
                            <div className="title-sm text-primary mb-2">Stats</div>
                            <div className="d-flex flex-column gap-2 small text-muted">
                                <div className="d-flex justify-content-between">
                                    <span>Total ingredients</span>
                                    <strong>{stats.total}</strong>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Missing nutrition</span>
                                    <strong className={stats.missingNutrition > 0 ? 'text-warning' : 'text-success'}>
                                        {stats.missingNutrition}
                                    </strong>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Unused</span>
                                    <strong>{stats.unused}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </SimpleBar>
            </Nav>

            <CreateNewIngredient show={addNewContact} close={() => setAddNewContact(false)} />
        </>
    )
}

export default IngredientAppSidebar
