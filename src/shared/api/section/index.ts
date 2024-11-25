import { axiosInstance, withAuth } from "../http-client";

export const deleteSectionCourse = withAuth(async (id: number,config = {}) => {
    return (await axiosInstance.delete(`api/sections/${id}`,config)).data;
})

export const getSectionCourseById = withAuth(async (id: number, config ={}) => {
    const data = (await axiosInstance.get(`api/sections/${id}`, config)).data;

    return data.data;
})