import React, { useState } from 'react';
import classNames from 'classnames';
import RecipeAppSidebar from '../RecipeAppSidebar';
import EditRecipeBody from './EditRecipeBody';
import EditRecipeHeader from './EditRecipeHeader';

const EditContact = () => {
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <div className="hk-pg-body py-0">
            <div className={classNames("contactapp-wrap", { "contactapp-sidebar-toggle": showSidebar })}>
                <RecipeAppSidebar />
                <div className="contactapp-content">
                    <div className="contactapp-detail-wrap">
                        <EditRecipeHeader toggleSidebar={() => setShowSidebar(!showSidebar)} show={showSidebar} />
                        <EditRecipeBody />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default EditContact
