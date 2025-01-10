import {axiosInstance} from "@/shared/api/http-client";

export const sendFeedBack = async (form: FormData) => {
    const data = (await axiosInstance.post('api/send-feedback', form, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })).data

    return data.data;
}