import {UserProfile} from "@/entities/user-profile/model/UserProfileStore";

import { axiosInstance } from "../http-client"

import {StatusUserEnum, User, UserRole} from "./model";

type ChangeUserRoleDto = {
    userId: string;
    role: UserRole
}
type ChangeBlockUserDto = {
    userId: number;
    status: StatusUserEnum
}
export const getUserById = async (userId: string) => {
    const data = (await axiosInstance.get(`api/users/${userId}`)).data;

    return data.data;
}

export const updateRole = async (body: ChangeUserRoleDto) => (await axiosInstance.put('/api/change-user-role', {
        userId: body.userId,
        role: body.role
    })).data

export const getUserProfile = async () => {
    const data = (await axiosInstance.get('/api/profile-user')).data

    return data.data;
}

export const updateProfile = async (user: UserProfile) => (await axiosInstance.put('api/profile',user)).data

export const uploadProfileAvatar = async (form: FormData) => (await axiosInstance.put(`api/upload-avatar`,form,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })).data

export const handleBlockUser = async (body: ChangeBlockUserDto) => {
    const data = (await axiosInstance.put('/api/block-user', {
        userId: body.userId,
        status: body.status
    })).data;

    return data.data;
}

export const searchUsers = async (query: string) => {
    const data = (await axiosInstance.get(`api/search-users?query=${query}`)).data;

    return data.data;
}


export const getAllUsers = async (): Promise<User[]> => {
    const data = (await axiosInstance.get(`api/users`)).data

    return data.data
}

export const deleteUser = async (id: string) => {
    const data = (await axiosInstance.delete(`/api/users?id=${id}`)).data;

    return data.data
}