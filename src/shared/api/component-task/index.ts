import { axiosInstance } from "../http-client"

export * from "./model"

export const getAllComponents = async () => {
    const data  = (await axiosInstance.get('/api/component-task')).data

    return data.data
}