import { CourseComponentTypeI } from "../course/model"
import { axiosInstance } from "../http-client"

export * from "./model"

export const getAllComponents = async () => {
    const data  = (await axiosInstance.get('/api/component-task')).data

    return data.data
}

export const createComponent = async (body: CourseComponentTypeI) => {
    const data = (await axiosInstance.post('api/component-task', body)).data

    return data.data;
}

export const deleteComponent = async (id: number) => {
   return (await axiosInstance.delete(`api/component-task/${id}`)).data
}

export const changeComponent = async (body: CourseComponentTypeI) => {
    return (await axiosInstance.put('api/component-task', body)).data
}