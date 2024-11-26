import { MainSection } from "@/stores/SectionCourse";
import { axiosInstance, withAuth } from "../http-client";

export const deleteSectionCourse = withAuth(async (id: number,config = {}) => {
    return (await axiosInstance.delete(`api/sections/${id}`,config)).data;
})

export const getSectionCourseById = withAuth(async (id: number, config ={}) => {
    const data = (await axiosInstance.get(`api/sections/${id}`, config)).data;

    return data.data;
})

export const createMainCourseSection = withAuth(async (mainSection: MainSection, config = {}) => {
    const data = (await axiosInstance.post('api/main-section',mainSection, config)).data;

    return data.data;
})

export const getMainCourseSection = withAuth(async (id: number,config = {}) => {
    const data = (await axiosInstance.get('api/main-section', config)).data;

    return data.data;
})