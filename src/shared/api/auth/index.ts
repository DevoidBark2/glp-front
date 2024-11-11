import { axiosInstance, withAuth } from "../http-client"
import { ChnagePasswordType } from "./model"

export const changePassword = withAuth(async (values: ChnagePasswordType, config = {}) => {
    return (await axiosInstance.post('/api/change-password',values,config)).data;
})