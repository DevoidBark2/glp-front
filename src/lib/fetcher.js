import axios from "axios"
import {delete_cookie_by_name} from "@/lib/users";

const logoutUser = () => {
    delete_cookie_by_name("userToken")
    delete_cookie_by_name("admin_auth")
    window.localStorage.removeItem("user_data")
    window.location.href = "/login"
}
export const POST = async (url, values) => {
    try{
        const response = await axios.post(url, values)
        return response.data
    }catch (e){
        if(e.response.status === 401){
            logoutUser();
        }
        else{
            throw e
        }
    }
}

export const GET = async (url) => {
    try{
        const {data} = await axios.get(url)
        return data
    }catch (e){
        if(e.response.status === 401){
            logoutUser();
        }
        else{
            throw e
        }
    }
}
export const PUT = async (url, values) => {

    try {
        const { data } = await axios.put(url, values);
        return data;
    }catch (e){
        if(e.response.status === 401){
            logoutUser();
        }
        else{
            throw e
        }
    }
}

export const DELETE = async (url) => {
    try{
        const { data } = await axios.delete(url);
        return data;
    }catch (e){
        if(e.response.status === 401){
            logoutUser();
        }
        else{
            throw e
        }
    }
}

export const isServer = typeof window === 'undefined';
