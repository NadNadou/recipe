import React, { useState } from 'react';
import classNames from 'classnames';
import IngredientAppHeader from '../IngredientAppHeader';
import IngredientAppSidebar from '../IngredientAppSidebar';
import IngredientCardsBody from './IngredientCardsBody';

const IngredientCards = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    return (
        <div className="hk-pg-body py-0">
            <div className={classNames("contactapp-wrap", { "contactapp-sidebar-toggle": showSidebar })}>
                <IngredientAppSidebar />
                <div className="contactapp-content">
                    <div className="contactapp-detail-wrap">
                        <IngredientAppHeader toggleSidebar={() => setShowSidebar(!showSidebar)} show={showSidebar} />
                        <IngredientCardsBody />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default IngredientCards
