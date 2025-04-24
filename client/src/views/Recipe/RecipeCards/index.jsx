import React, { useState } from 'react';
import classNames from 'classnames';
import RecipeAppHeader from '../RecipeAppHeader';
import RecipeAppSidebar from '../RecipeAppSidebar';
import RecipeCardsBody from './RecipeCardsBody';

const RecipeCards = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    return (
        <div className="hk-pg-body py-0">
            <div className={classNames("contactapp-wrap", { "contactapp-sidebar-toggle": showSidebar })}>
                <RecipeAppSidebar />
                <div className="contactapp-content">
                    <div className="contactapp-detail-wrap">
                        <RecipeAppHeader toggleSidebar={() => setShowSidebar(!showSidebar)} show={showSidebar} />
                        <RecipeCardsBody />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default RecipeCards
