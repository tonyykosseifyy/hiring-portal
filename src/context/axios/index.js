import React, {useEffect, useState} from 'react'
import {useMemo} from "react";
import Axios from 'axios'
import Cookies from 'js-cookie';
import {AUTHENTICATION_API_ROUTE, FAVORITES_API_ROUTE, STUDENTS_API_ROUTE, USER_API_ROUTE, JOB_TYPES_API_ROUTE, MAJORS_API_ROUTE, SKILLS_API_ROUTE, LANGUAGES_API_ROUTE} from "./api-routes";
import { useAuth0 } from "@auth0/auth0-react";

const AxiosContext = React.createContext();

export default function AxiosProvider({
                                          children,
                                      }) {

    const { getAccessTokenSilently }  = useAuth0()
    const axios = useMemo(() => {
        const axios = Axios.create({
            baseURL: process.env.REACT_APP_API_HOST,
            headers: {
                "Content-Type": "application/json",
            },
        });

        axios.interceptors.request.use((config) => {
            const token = Cookies.get("se-token")
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        });

        return axios;
    }, []);
    // All modified by meee :D
    // Students
    // filter = { languages: ["Frensh"] } ...
    const displayError = (err) => {
        console.log(err)
        return {
            data: {
                data: [],
                message: 'Error'
            }
        }
    }
    const getStudents = async (filter) => {
        try {
             return await axios.post(STUDENTS_API_ROUTE,filter) ;
        } catch(err) {
            return displayError(err);
        }
    }

    const getSkills = async () => {
        try {
            return await axios.get(SKILLS_API_ROUTE) ;
        } catch(err) {
            return displayError(err);
        }
    }
    const getLanguages = async () => {
        try {
            return await axios.get(LANGUAGES_API_ROUTE) ;
        } catch(err) {
            return displayError(err);
        }
    }
    const getJobTypes = async () => {
        try {
            return await axios.get(JOB_TYPES_API_ROUTE) ;
        } catch(err) {
            return displayError(err);
        }
    }
    const getMajors = async () => {
        try {
            return await axios.get(MAJORS_API_ROUTE) ;
        } catch(err) {
            return displayError(err);
        }
    }
    // User
    const postLogin = ({email, password}) =>
        fetch(process.env.REACT_APP_API_HOST+AUTHENTICATION_API_ROUTE).then(data => data);

    const getUser = () => axios.get(USER_API_ROUTE).then(data => data);

    // Favorites
    const getFavorites = async () => {
        try {
            return await axios.get(FAVORITES_API_ROUTE) ;
        } catch(err) {
            return displayError(err);
        }
    }

    const createFavorite = (id) => {
        try {
            return axios.post(FAVORITES_API_ROUTE, {student_id: id}) ;
        } catch(err) {
            return displayError(err);
        }
    }

    const deleteFavorite = (id) => {
        try {
            return axios.delete(FAVORITES_API_ROUTE + '/' + id) ;
        } catch(err) {
            return displayError(err);
        }
    }


    return (
        <AxiosContext.Provider value={{
            axios,
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
                getMajors
            }
        }}>{children}</AxiosContext.Provider>
    );
}

export const useAxios = () => {
    const context = React.useContext(AxiosContext);
    if (context === undefined) {
        throw new Error('useAxios must be used within a AxiosContextProvider');
    }

    const { axios, Api } = context

    return {
        axios,
        Api
    }
}