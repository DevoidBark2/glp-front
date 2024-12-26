import { axiosInstance, withAuth } from "../http-client"
import { ChangePasswordType } from "./model"

export const register = async (body: any) => {
    const data = (await axiosInstance.post('/api/register', body)).data
    return data.data;
}

export const login = async (body: any) => {
    const data = (await axiosInstance.post('/api/login', body)).data

    return data.data;
}

export const changePassword = withAuth(async (values: ChangePasswordType, config = {}) => {
    return (await axiosInstance.post('/api/change-password',values,config)).data;
})