import axios from 'axios';

// Create a new instance of Axios with baseURL
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URI,
});

// Add request interceptor
instance.interceptors.request.use(
    function (config) {
        // Perform actions before the request is sent
        let localStorageData = window.localStorage.getItem('persist:shop/user')
        if(localStorageData && typeof localStorageData === 'string'){
             localStorageData = JSON.parse(localStorageData)
             const accessToken = JSON.parse(localStorageData?.token)
             config.headers = {authorization: `Bearer ${accessToken}`}
             return config
        } else return config;
    },
    function (error) {
        // Handle request errors
        return Promise.reject(error);
    }
);

// Add response interceptor
instance.interceptors.response.use(
    function (response) {
        return response.data;  // Return the response data directly
    },
    function (error) {
        // Ensure we have a valid error response
        const errorResponse = error.response?.data || error.message || 'An error occurred.';
        return Promise.reject(errorResponse);
    }
);

export default instance;
