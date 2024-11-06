import { axiosInstance, withAuth } from "../http-client";
import { SupportItem } from "./model";

export const sendMsgInSupport = async (supportItem: SupportItem) => {
    const data = (await axiosInstance.post('api/support', supportItem)).data;

    return data.data;
}

export const sendMsgFromSupport = withAuth(async (supportItem: SupportItem, answer: string, config = {}) => {
    const data = (await axiosInstance.post('api/support/send-user', { ...supportItem, answer: answer }, config)).data;

    return data.data;
})