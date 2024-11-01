import { getUserToken } from "@/lib/users";
import axios from "axios";
import nextConfig from "next.config.mjs";

export const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: nextConfig.env?.API_URL
})

export const withAuth = <T>(apiCall: (...args: any[]) => Promise<T>) => {
    return async (...args: any[]): Promise<T> => {
        const token = getUserToken();
        const config = args[1] || {};
        
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }
        
        return apiCall(args[0], config);
    };
};