import Axios from "axios" ;
import { STUDENTS_API_ROUTE, SKILLS_API_ROUTE, LANGUAGES_API_ROUTE, JOB_TYPES_API_ROUTE, MAJORS_API_ROUTE,FAVORITES_API_ROUTE,   } from "./api-routes";
import Cookies from 'js-cookie';

const axios = Axios.create({
    baseURL: process.env.REACT_APP_API_HOST,
    headers: {
        "Content-Type": "application/json",
    },
});

axios.interceptors.request.use((config) => {
    const token = Cookies.get("se-token")
    if (token) {
        // config.headers.Authorization = `Bearer ${token}`;
        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg2NjQ5OTY3LCJleHAiOjE2ODkyNDE5Njd9.QDSS4hVTbtz_Eo6ZGJCu-BfRq1aDmKMm9WJFCRE4SBc
        
    }

    config.headers.Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg2NjQ5OTY3LCJleHAiOjE2ODkyNDE5Njd9.QDSS4hVTbtz_Eo6ZGJCu-BfRq1aDmKMm9WJFCRE4SBc';

    return config;
});


const displayError = (err) => {
    console.log(err)
    return {
        data: {
            data: [],
            message: 'Error'
        }
    }
}

export const getStudents = async (filter) => await axios.post(STUDENTS_API_ROUTE + "/findByFilters",filter) ;

export const getInitialStudent = axios.post(STUDENTS_API_ROUTE + "/findByFilters");
export const getSkills = axios.get(SKILLS_API_ROUTE) ;
export const getLanguages = axios.get(LANGUAGES_API_ROUTE) ;
export const getJobTypes = axios.get(JOB_TYPES_API_ROUTE) ;
export const getMajors = axios.get(MAJORS_API_ROUTE) ;
export const getCurrentUser = axios.get('/users/me');



// export const getUser = () => axios.get(USER_API_ROUTE).then(data => data);

// Favorites
export const getFavorites = async () => {
    try {
        return await axios.get(FAVORITES_API_ROUTE) ;
    } catch(err) {
        return displayError(err);
    }
}

export const createFavorite = (id) => {
    try {
        return axios.post(STUDENTS_API_ROUTE + `/addFavorite/${id}`) ;
    } catch(err) {
        return displayError(err);
    }
}



export const deleteFavorite = (id) => {
    try {
        return axios.delete(STUDENTS_API_ROUTE + `/deleteFavorite/${id}`) ;
    } catch(err) {
        return displayError(err);
    }
}