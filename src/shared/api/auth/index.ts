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

export const oauthByProvider = async (provider: 'google' | 'yandex') => {
    const data = (await axiosInstance.get(`/api/auth/oauth/connect/${[provider]}`)).data

    return data.data
}

export const verificationEmail = async (token: string | null) => {
    const data = (await axiosInstance.post('/api/email-confirmation', {token})).data

    return data.data
}

export const newPassword = async (password: string, token: string | null) => {

    const data = (await axiosInstance.post(`/api/new-password/${token}`, password)).data

    return data.data;
}

export const resetPassword = async (email: string) => {
    const data = (await axiosInstance.post('/api/reset-password', email)).data

    return data.data
}

export const changePassword = withAuth(async (values: ChangePasswordType, config = {}) => {
    return (await axiosInstance.post('/api/change-password',values,config)).data;
})