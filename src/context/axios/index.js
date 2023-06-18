import React, {useEffect, useState} from 'react'
import {useMemo} from "react";
import Axios from 'axios'
import Cookies from 'js-cookie';
import {AUTHENTICATION_API_ROUTE, FAVORITES_API_ROUTE, STUDENTS_API_ROUTE, USER_API_ROUTE, JOB_TYPES_API_ROUTE, MAJORS_API_ROUTE, SKILLS_API_ROUTE, LANGUAGES_API_ROUTE} from "./api-routes";
import { useAuth0 } from "@auth0/auth0-react";

const AxiosContext = React.createContext();

export default function AxiosProvider({ children }) {
    const { logout } = useAuth0();
    const [token, setToken] = useState(Cookies.get("se-token"));

    const axios = useMemo(() => {
        const axios = Axios.create({
            baseURL: process.env.REACT_APP_API_HOST,
            headers: {
                "Content-Type": "application/json",
            },
        });

        axios.interceptors.request.use((config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        return axios;
    }, [token]);

    const displayError = (err) => {
        return {
            data: {
                data: [],
                message: 'Error'
            }
        }
    }
    
    const getStudents = async (filter) => await axios.post(STUDENTS_API_ROUTE + "/findByFilters",filter) ;
    
    const getInitialStudent = () => axios.post(STUDENTS_API_ROUTE + "/findByFilters");
    const getSkills = () => axios.get(SKILLS_API_ROUTE) ;
    const getLanguages = () => axios.get(LANGUAGES_API_ROUTE) ;
    const getJobTypes = () => axios.get(JOB_TYPES_API_ROUTE) ;
    const getMajors = () => axios.get(MAJORS_API_ROUTE) ;
    const getCurrentUser = () => axios.get('/users/me');
    
    
    const createFavorite = (id) => {
        try {
            return axios.post(STUDENTS_API_ROUTE + `/addFavorite/${id}`) ;
        } catch(err) {
            return displayError(err);
        }
    }
    
    const deleteFavorite = (id) => {
        try {
            return axios.delete(STUDENTS_API_ROUTE + `/deleteFavorite/${id}`) ;
        } catch(err) {
            return displayError(err);
        }
    }
    // User
    const postLogin = ({email, password}) =>
        fetch(process.env.REACT_APP_API_HOST+AUTHENTICATION_API_ROUTE).then(data => data);

    const getUser = () => axios.get(USER_API_ROUTE).then(data => data)

    // Favorites
    const getFavorites = async () => {
        try {
            return await axios.get(FAVORITES_API_ROUTE) ;
        } catch(err) {
            return displayError(err);
        }
    }

    return (
        <AxiosContext.Provider value={{
            axios,
            setToken,
            Api : {
                getStudents,
                postLogin,
                getUser,
                getFavorites,
                createFavorite,
                deleteFavorite,
                getSkills,
                getLanguages,
                getJobTypes,
                getMajors,
                getInitialStudent,
                getCurrentUser
            }
        }}>{children}</AxiosContext.Provider>
    );
}

export const useAxios = () => {
    const context = React.useContext(AxiosContext);
    if (context === undefined) {
        throw new Error('useAxios must be used within a AxiosContextProvider');
    }

    const { axios, Api, setToken } = context

    return {
        axios,
        setToken,
        Api,
    }
}