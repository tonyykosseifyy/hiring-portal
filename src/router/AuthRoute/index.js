import React, {useEffect} from "react";
import {Redirect, Route, useHistory, useLocation} from "react-router-dom";
// import VerifyEmail from "../../pages/VerifyEmail";
import Loader from "../../components/Loader";
import Cookies from 'js-cookie';
import {hooks} from "../../api";
import {AUTH_ROUTE, HIRING_PORTAL_ROUTE} from "../../utils/routes";
import {useAuth0} from "@auth0/auth0-react";

const AuthRoute = ({component: Component, ...args}) => {
    const {isLoading, isAuthenticated, loginWithRedirect, user} = useAuth0();
    let isLoggedIn = Cookies.get('se-token');

    // Just for test: added by me 
    // isLoggedIn = true ;
    // Cookies.set('se-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjg1NjkyMjk5LCJleHAiOjE2ODgyODQyOTl9.ER9T28klY-WJ0AeeAcw13ItnEGgsWJUNS3hoznnGBs0');
    // finised testing: me
    // d446fe1fec82196c815c7d5f9efd6b839fec43342b07a6cf5246d75264ab3185d013ffd0f717d4548056bccece6c757ed4883aee3e751af251fadbb41d2f42e32d272ce9e0a0a68457b5b7999247739ca0e8622e1ea301a56d187c16b625d06e5f9392be77039f8781cfa7ce0771542950c9d6e57a6ad5d40f68579435ce4cdf
    // LAST CORRECT TOKEN: 
    // Cookies.set('se-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg2NjQ5OTY3LCJleHAiOjE2ODkyNDE5Njd9.QDSS4hVTbtz_Eo6ZGJCu-BfRq1aDmKMm9WJFCRE4SBc')

    const { push } = useHistory();
    console.log(isLoggedIn)
    // const { data: dbUser, isLoading: isLoadingUser} = hooks.useCurrentUser();
    // useEffect(() => {
    //     if(user) {
    //         portalAccessed({user})
    //     }
    // }, [user])
    let dbUser = true ;


    return (<Route
        render={(props) => {
                if (Boolean(isLoggedIn)) {
                    if (dbUser) {
                        // if (user.email_verified) {
                            return <Component {...props}/>
                        // } else {
                        //     return <VerifyEmail />
                        // }
                    }
                    else{
                        return <Loader SELogo/>
                    }
                } else {
                    window.location.href = (process.env.REACT_APP_API_HOST + 'connect/auth0')
                    return (<Loader SELogo/>)
                }
        }}

        {...args}
    />)
};

export default AuthRoute;

