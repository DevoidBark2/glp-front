import { axiosInstance } from "../http-client"

export const getUserById = async (userId: number) => {
    const data = (await axiosInstance.get(`api/users/${userId}`)).data;

    return data.data;
}