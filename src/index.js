import React from 'react';
import ReactDOM from 'react-dom';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import ModalProvider from 'mui-modal-provider';
import {BrowserRouter as Router} from "react-router-dom";
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { NAWAYA_LIGHT_GREY, NAWAYA_PURPLE } from "./utils/constants/colors";
import Auth0ProviderWithHistory from "./auth/auth0-provider-with-history";
import {CssBaseline} from "@mui/material";
import AxiosProvider from "./context/axios";

const Theme = createTheme({
    palette: {
        primary: {
            main: NAWAYA_PURPLE,
        },
        secondary: {
            main: NAWAYA_LIGHT_GREY
        }
    },
    typography: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 'normal',
    },});


ReactDOM.render(
    <Router>
        <Auth0ProviderWithHistory>
            <AxiosProvider>
                <ThemeProvider theme={Theme}>
                    <CssBaseline/>
                    <ModalProvider>
                        <App />
                    </ModalProvider>
                </ThemeProvider>
            </AxiosProvider>

        </Auth0ProviderWithHistory>
    </Router>
        ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
