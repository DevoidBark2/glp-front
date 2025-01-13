import { axiosInstance, withAuth } from "../http-client"
import { StatusUserEnum, UserRole } from "./model";
import {UserProfile} from "@/stores/UserProfileStore";

type ChangeUserRoleDto = {
    userId: number;
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

export const updateRole = withAuth(async (body: ChangeUserRoleDto, config = {}) => {
    return (await axiosInstance.put('/api/change-user-role', {
        userId: body.userId,
        role: body.role
    }, config)).data;

})

export const getUserProfile = async () => {
    const data = (await axiosInstance.get('/api/profile-user')).data

    return data.data;
}

export const updateProfile = async (user: UserProfile) => {
    return (await axiosInstance.put('api/profile',user)).data;
}

export const uploadProfileAvatar = async (form: FormData) => {
    return (await axiosInstance.put(`api/upload-avatar`,form,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })).data;
}

export const handleBlockUser = withAuth(async (body: ChangeBlockUserDto, config = {}) => {
    const data = (await axiosInstance.put('/api/block-user', {
        userId: body.userId,
        status: body.status
    }, config)).data;

    return data.data;
})

export const searchUsers = async (query: string) => {
    const data = (await axiosInstance.get(`api/search-users?query=${query}`)).data;

    return data.data;
}
