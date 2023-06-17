import React from 'react'
import './App.css';
import {Route, Switch} from "react-router-dom";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import {ROUTES_WITH_LAYOUT} from "./utils/routes";
import AuthRoute from "./router/AuthRoute";
import LoginRedirect from "./pages/LoginRedirect";
import { useAxios } from './context/axios';

const App = () => {
  const { setToken } = useAxios();
  return (
      <Switch>
          <Route exact path="/connect/:providerName">
            <LoginRedirect setToken={setToken}/>
          </Route>
          {
              ROUTES_WITH_LAYOUT.map(({layout: Layout, routes, basePath, exact}) =>
              {

                return (
                    <Route key={`routey-${basePath}`} path={basePath} exact={exact}>
                      <Layout>
                        <Switch>
                          {routes.map(({path, component, protectedRoute, exact: exactRoute}, index) => {
                              return (
                                  protectedRoute?
                                  <AuthRoute key={`route-${index}-pro`} path={path} exact={exactRoute} component={component}/>
                                      :
                                  <Route key={`route-${index}`} path={path} exact={exactRoute} component={component} />
                              )
                            }
                          )}
                        </Switch>
                      </Layout>
                    </Route>
                  )
              }
              )
          }</Switch>
  );
}

export default App;
