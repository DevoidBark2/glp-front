import axios from "axios";
import {getUserToken} from "@/lib/users";
import nextConfig from "../../next.config.mjs";

const token = getUserToken();

export const axiosInstance = axios.create({
    baseURL: nextConfig.env?.API_URL,
    headers: {
        Authorization: `Bearer ${token}`
    }
})