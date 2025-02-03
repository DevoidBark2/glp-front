import axios from "axios";
import nextConfig from "next.config.mjs";

export const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: nextConfig.env?.API_URL
})