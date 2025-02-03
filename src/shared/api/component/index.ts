import { CourseComponentTypeI } from "../course/model";
import { axiosInstance } from "../http-client"

export const getComponentTask = async (id: number): Promise<CourseComponentTypeI> => {
    const data = (await axiosInstance.get(`api/component-task/${id}`)).data;
    return data.data;
}

export const searchComponentByTitle = async (query: string) => {
    const data = (await axiosInstance.get(`api/search-components?query=${query}`)).data

    return data.data
}