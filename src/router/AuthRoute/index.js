import React from "react";
import { Route } from "react-router-dom";
import Loader from "../../components/Loader";
import Cookies from 'js-cookie';

const AuthRoute = ({component: Component, ...args}) => {
    let isLoggedIn = Cookies.get('nawaya-token');

    return (<Route
        render={(props) => {
            if (Boolean(isLoggedIn)) {
                return <Component {...props}/>
            } else {
                window.location.href = (process.env.REACT_APP_API_HOST + 'connect/auth0')
                return (<Loader SELogo/>)
            }
        }}
        {...args}
    />)
};

export default AuthRoute;

