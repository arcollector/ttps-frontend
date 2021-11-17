import axios from "axios";

axios.interceptors.response.use(null, error=>{
    const errorcode= 
    error.response&&
    error.response.status>=400&&
    error.response.status<=500;
    
    if(errorcode){
        console.log("Somethin went wrong");
    }

    return Promise.reject(error);
    
});

// eslint-disable-next-line import/no-anonymous-default-export
export default{
    get:axios.get,
    post:axios.post,
}

const REACT_APP_BACKEND_HOSTNAME = process.env.REACT_APP_BACKEND_HOSTNAME || 'http://localhost';
const REACT_APP_BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || '8080';
export const BACKEND_URL = `${REACT_APP_BACKEND_HOSTNAME}:${REACT_APP_BACKEND_PORT}`;
