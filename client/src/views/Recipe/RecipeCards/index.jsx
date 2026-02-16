import React, { useState } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import RecipeAppHeader from '../RecipeAppHeader';
import RecipeAppSidebar from '../RecipeAppSidebar';
import RecipeCardsBody from './RecipeCardsBody';

const RecipeCards = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [activeTag, setActiveTag] = useState('all');
    const [activeAppliance, setActiveAppliance] = useState('all');
    const [showBatchOnly, setShowBatchOnly] = useState(false);
    const [showMissingNutrition, setShowMissingNutrition] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    const recipes = useSelector(state => state.recipeReducer.recipes);

    return (
        <div className="hk-pg-body py-0">
            <div className={classNames("contactapp-wrap", { "contactapp-sidebar-toggle": showSidebar })}>
                <RecipeAppSidebar
                    activeTag={activeTag}
                    onTagChange={setActiveTag}
                    activeAppliance={activeAppliance}
                    onApplianceChange={setActiveAppliance}
                    showBatchOnly={showBatchOnly}
                    onToggleBatch={() => setShowBatchOnly(!showBatchOnly)}
                    showMissingNutrition={showMissingNutrition}
                    onToggleMissingNutrition={() => setShowMissingNutrition(!showMissingNutrition)}
                    recipes={recipes}
                />
                <div className="contactapp-content">
                    <div className="contactapp-detail-wrap">
                        <RecipeAppHeader
                            toggleSidebar={() => setShowSidebar(!showSidebar)}
                            show={showSidebar}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                        />
                        <RecipeCardsBody
                            activeTag={activeTag}
                            activeAppliance={activeAppliance}
                            showBatchOnly={showBatchOnly}
                            showMissingNutrition={showMissingNutrition}
                            viewMode={viewMode}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecipeCards
