import {axiosInstance} from "@/shared/api/http-client";
import {UserLevel} from "@/shared/api/users-level/model";

export const getAllUsersLevel = async () : Promise<UserLevel[]>=> {
    const data = (await axiosInstance.get('/api/users-levels')).data

    return data.data
}