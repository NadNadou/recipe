import React, { useState, useMemo } from 'react';
import { Button, Nav, Form, Badge } from 'react-bootstrap';
import { AlertTriangle, Layers } from 'react-feather';
import SimpleBar from 'simplebar-react';
import { useSelector } from 'react-redux';
import CreateNewRecipe from './CreateNewRecipe';

const RecipeAppSidebar = ({
    activeTag,
    onTagChange,
    activeAppliance,
    onApplianceChange,
    showBatchOnly,
    onToggleBatch,
    showMissingNutrition,
    onToggleMissingNutrition,
    recipes = [],
}) => {
    const [addNewRecipe, setAddNewRecipe] = useState(false);
    const tags = useSelector(state => state.metadataReducer.tags);
    const cookingAppliances = useSelector(state => state.metadataReducer.cookingAppliances);

    const stats = useMemo(() => {
        const total = recipes.length;
        const batchCount = recipes.filter(r => r.isBatchCookingDefault).length;
        const missingNutrition = recipes.filter(
            r => !r.nutrition || !r.nutrition.calories || r.nutrition.calories === 0
        ).length;

        const totalTime = recipes.reduce((sum, r) => sum + (r.prepTime || 0) + (r.cookTime || 0), 0);
        const avgTime = total > 0 ? Math.round(totalTime / total) : 0;

        // Count recipes per tag
        const byTag = {};
        tags.forEach(tag => { byTag[tag._id] = 0; });
        recipes.forEach(recipe => {
            (recipe.tagIds || []).forEach(tag => {
                const tagId = typeof tag === 'object' ? tag._id : tag;
                byTag[tagId] = (byTag[tagId] || 0) + 1;
            });
        });

        // Count recipes per appliance
        const byAppliance = {};
        cookingAppliances.forEach(app => { byAppliance[app.value] = 0; });
        recipes.forEach(recipe => {
            (recipe.cookingAppliances || []).forEach(app => {
                byAppliance[app] = (byAppliance[app] || 0) + 1;
            });
        });

        return { total, batchCount, missingNutrition, avgTime, byTag, byAppliance };
    }, [recipes, tags, cookingAppliances]);

    return (
        <>
            <Nav className="contactapp-sidebar">
                <SimpleBar className="nicescroll-bar">
                    <div className="menu-content-wrap">
                        <Button
                            variant="primary"
                            className="btn-rounded btn-block mb-4"
                            onClick={() => setAddNewRecipe(true)}
                        >
                            Add new recipe
                        </Button>

                        {/* Tags */}
                        <div className="menu-group">
                            <div className="title-sm text-primary mb-2">Tags</div>
                            <Nav className="nav-light navbar-nav flex-column">
                                <Nav.Item>
                                    <Nav.Link
                                        active={activeTag === 'all'}
                                        onClick={() => onTagChange('all')}
                                        className="d-flex justify-content-between align-items-center"
                                    >
                                        <span className="nav-link-text">All</span>
                                        <Badge bg="light" text="dark" pill className="ms-auto">
                                            {stats.total}
                                        </Badge>
                                    </Nav.Link>
                                </Nav.Item>
                                {tags.map(tag => (
                                    stats.byTag[tag._id] > 0 && (
                                        <Nav.Item key={tag._id}>
                                            <Nav.Link
                                                active={activeTag === tag._id}
                                                onClick={() => onTagChange(tag._id)}
                                                className="d-flex justify-content-between align-items-center"
                                            >
                                                <span className="nav-link-text">{tag.label}</span>
                                                <Badge bg="light" text="dark" pill className="ms-auto">
                                                    {stats.byTag[tag._id]}
                                                </Badge>
                                            </Nav.Link>
                                        </Nav.Item>
                                    )
                                ))}
                            </Nav>
                        </div>

                        <div className="separator separator-light" />

                        {/* Cooking Appliances */}
                        <div className="menu-group">
                            <div className="title-sm text-primary mb-2">Cooking Appliances</div>
                            <Nav className="nav-light navbar-nav flex-column">
                                <Nav.Item>
                                    <Nav.Link
                                        active={activeAppliance === 'all'}
                                        onClick={() => onApplianceChange('all')}
                                        className="d-flex justify-content-between align-items-center"
                                    >
                                        <span className="nav-link-text">All</span>
                                    </Nav.Link>
                                </Nav.Item>
                                {cookingAppliances.map(app => (
                                    stats.byAppliance[app.value] > 0 && (
                                        <Nav.Item key={app.value}>
                                            <Nav.Link
                                                active={activeAppliance === app.value}
                                                onClick={() => onApplianceChange(app.value)}
                                                className="d-flex justify-content-between align-items-center"
                                            >
                                                <span className="nav-link-text">
                                                    {app.icon} {app.label}
                                                </span>
                                                <Badge bg="light" text="dark" pill className="ms-auto">
                                                    {stats.byAppliance[app.value]}
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
                                id="filter-batch-cooking"
                                label={
                                    <span className="d-flex align-items-center gap-1">
                                        <Layers size={14} className="text-info" />
                                        Batch cooking
                                        <Badge bg="info" pill className="ms-auto">
                                            {stats.batchCount}
                                        </Badge>
                                    </span>
                                }
                                checked={showBatchOnly}
                                onChange={onToggleBatch}
                                className="mb-2"
                            />
                            <Form.Check
                                type="switch"
                                id="filter-missing-nutrition-recipe"
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
                        </div>

                        <div className="separator separator-light" />

                        {/* Stats */}
                        <div className="menu-group">
                            <div className="title-sm text-primary mb-2">Stats</div>
                            <div className="d-flex flex-column gap-2 small text-muted">
                                <div className="d-flex justify-content-between">
                                    <span>Total recipes</span>
                                    <strong>{stats.total}</strong>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Batch cooking</span>
                                    <strong className="text-info">{stats.batchCount}</strong>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Missing nutrition</span>
                                    <strong className={stats.missingNutrition > 0 ? 'text-warning' : 'text-success'}>
                                        {stats.missingNutrition}
                                    </strong>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Avg cook time</span>
                                    <strong>{stats.avgTime} min</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </SimpleBar>
            </Nav>

            <CreateNewRecipe show={addNewRecipe} close={() => setAddNewRecipe(false)} />
        </>
    )
}

export default RecipeAppSidebar
