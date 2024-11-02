import axios from "axios"
import {delete_cookie_by_name, getUserToken} from "@/lib/users";
import {UNAUTHORIZED_STATUS_CODE} from "@/constants";

const logoutUser = () => {
    delete_cookie_by_name("userToken")
    delete_cookie_by_name("admin_auth")
    window.localStorage.removeItem("user_data")
    window.location.href = "/platform"
}
export const POST = async (url, values) => {
    const token = getUserToken();
    try{
        const response = await axios.post(url, values,{
            headers: {
                Authorization: token
            }
        })
        return response.data
    }catch (e){
        if(e.response.status === UNAUTHORIZED_STATUS_CODE){
            logoutUser();
        }
        else{
            throw e
        }
    }
}

export const GET = async (url) => {
    const token = getUserToken();
    try{
        const {data} = await axios.get(url,{
            headers: {
                Authorization: token
            }
        })
        return data
    }catch (e){
        if(e.response.status === UNAUTHORIZED_STATUS_CODE){
            logoutUser();
        }
        else{
            throw e
        }
    }
}
export const PUT = async (url, values) => {
    const token = getUserToken();
    try {
        const { data } = await axios.put(url, values,{
            headers: {
                Authorization: token
            }
        });
        return data;
    }catch (e){
        if(e.response.status === UNAUTHORIZED_STATUS_CODE){
            logoutUser();
        }
        else{
            throw e
        }
    }
}

export const DELETE = async (url) => {
    const token = getUserToken();
    try{
        const { data } = await axios.delete(url,{
            headers: {
                Authorization: token
            }
        });
        return data;
    }catch (e){
        if(e.response.status === UNAUTHORIZED_STATUS_CODE){
            logoutUser();
        }
        else{
            throw e
        }
    }
}

export const isServer = typeof window === 'undefined';
