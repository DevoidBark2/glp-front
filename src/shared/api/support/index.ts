import { axiosInstance } from "../http-client";
import { SupportItem } from "./model";

export const sendMsgInSupport = async (supportItem: SupportItem) => {
    const data = (await axiosInstance.post('api/support', supportItem)).data;

    return data.data;
}

export const sendMsgFromSupport = async (supportItem: SupportItem, answer: string) => {
    const data = (await axiosInstance.post('api/support/send-user', { ...supportItem, answer: answer })).data;

    return data.data;
}