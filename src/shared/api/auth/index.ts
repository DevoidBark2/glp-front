import { axiosInstance, withAuth } from "../http-client"
import { ChangePasswordType } from "./model"

export const changePassword = withAuth(async (values: ChangePasswordType, config = {}) => {
    return (await axiosInstance.post('/api/change-password',values,config)).data;
})