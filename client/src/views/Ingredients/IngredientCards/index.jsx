import React, { useState } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import IngredientAppHeader from '../IngredientAppHeader';
import IngredientAppSidebar from '../IngredientAppSidebar';
import IngredientCardsBody from './IngredientCardsBody';

const IngredientCards = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');
    const [showMissingNutrition, setShowMissingNutrition] = useState(false);
    const [showUnused, setShowUnused] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    const ingredients = useSelector(state => state.metadataReducer.ingredients);

    return (
        <div className="hk-pg-body py-0">
            <div className={classNames("contactapp-wrap", { "contactapp-sidebar-toggle": showSidebar })}>
                <IngredientAppSidebar
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    showMissingNutrition={showMissingNutrition}
                    onToggleMissingNutrition={() => setShowMissingNutrition(!showMissingNutrition)}
                    showUnused={showUnused}
                    onToggleUnused={() => setShowUnused(!showUnused)}
                    ingredients={ingredients}
                />
                <div className="contactapp-content">
                    <div className="contactapp-detail-wrap">
                        <IngredientAppHeader
                            toggleSidebar={() => setShowSidebar(!showSidebar)}
                            show={showSidebar}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                        />
                        <IngredientCardsBody
                            activeCategory={activeCategory}
                            showMissingNutrition={showMissingNutrition}
                            showUnused={showUnused}
                            viewMode={viewMode}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IngredientCards
