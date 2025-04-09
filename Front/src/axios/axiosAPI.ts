import axios from 'axios';

export const axiosAPI = axios.create({
    baseURL : `${import.meta.env.VITE_API_CLIENT}`,
    headers : {
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${localStorage.getItem('token')}`
    }
});

