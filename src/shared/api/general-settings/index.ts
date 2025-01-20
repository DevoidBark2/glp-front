import { axiosInstance } from "@/shared/api/http-client";

export const getGeneralSettings = async () => {
    const data = (await axiosInstance.get('api/general-settings')).data

    return data.data;
}

export const getFooterInfo = async () => {
    const data = (await axiosInstance.get('api/footer')).data

    return data.data
}

export const changeGeneralSettings = async (form: FormData) => {
    const data = (await axiosInstance.post('api/general-settings', form, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })).data

    return data.data;
}