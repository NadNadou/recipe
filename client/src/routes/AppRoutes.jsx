import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import LayoutHorizontal from '../layout/MainLayout/HorizontalLayout'
import { routes } from './RouteList'

import ProtectedRoute from './ProtectedRoute'

const AppRoutes = (props) => {

    const { match } = props;

    return (
        <Suspense
            fallback={
                <div className="preloader-it">
                    <div className="loader-pendulums" />
                </div>
            }>
            <LayoutHorizontal>
                <Switch>
                {routes.map((obj, i) => {
                    if (!obj.component) return null;

                    const RouteComponent = obj.protected ? ProtectedRoute : Route;

                    return (
                        <RouteComponent
                        key={i}
                        exact={obj.exact}
                        path={match.path + obj.path}
                        component={obj.component}
                        />
                    );
                    })}

                    <Route path="*">
                        <Redirect to="/error-404" />
                    </Route>
                </Switch>
            </LayoutHorizontal>
        </Suspense>
    )
}

export default AppRoutes
