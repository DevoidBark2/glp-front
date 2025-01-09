import { CourseComponentTypeI } from "../course/model";
import { axiosInstance, withAuth } from "../http-client"

export const getComponentTask = withAuth(async (id: number, config = {}): Promise<CourseComponentTypeI> => {
    const data = (await axiosInstance.get(`api/component-task/${id}`, config)).data;
    return data.data;
})

export const searchComponentByTitle = async (query: string) => {
    const data = (await axiosInstance.get(`api/search-components?query=${query}`)).data

    return data.data
}