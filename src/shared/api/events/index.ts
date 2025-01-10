import {axiosInstance} from "@/shared/api/http-client";

export const getAllEvents = async () => {
    const data = (await axiosInstance.get('api/events')).data;

    return data.data;
}