import { axiosInstance } from "../http-client"

import { ChangePasswordType } from "./model"

export const register = async (body: any) => {
    const data = (await axiosInstance.post('/api/register', body)).data
    return data.data;
}

export const login = async (body: any) => (await axiosInstance.post('/api/login', body)).data

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

export const changePassword = async (values: ChangePasswordType) => (await axiosInstance.post('/api/change-password',values)).data


export const logoutUser = async () => {
    const data = (await axiosInstance.post('/api/logout')).data

    return data.data;
}

export const deleteUserAccount = async () => {
    const data = (await axiosInstance.delete('/api/delete-account')).data
    return data.data;
}