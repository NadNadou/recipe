import React, { useState,useEffect } from 'react';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux';

import RecipeDetailSidebar from "./RecipeDetailSidebar";
import Header from './Header';
import Body from './Body';
import { getRecipeDetail } from '../../../redux/action/Recipes';

const RecipeDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch()
     const { recipeDetail} = useSelector(state => state.recipeReducer);
    const [showSidebar, setShowSidebar] = useState(true);

    useEffect(() => {
        if (id) {
          dispatch(getRecipeDetail(id));
        }
      }, [id]);

    return (
        <div className="hk-pg-body py-0">
            <div className={classNames("integrationsapp-wrap", { "integrationsapp-sidebar-toggle": !showSidebar })}>
                <RecipeDetailSidebar />
                <div className="integrationsapp-content">
                    <div className="integrationsapp-detail-wrap">
                        <Header toggleSidebar={() => setShowSidebar(!showSidebar)} show={showSidebar} />
                        <Body detail={recipeDetail} />
                    </div>                    
                </div>
            </div>
        </div>

    )
}

export default RecipeDetail
