import {MainSection} from "@/stores/SectionCourse";
import { axiosInstance, withAuth } from "../http-client";

export const getCPAllSection = async () => {
    const data = (await axiosInstance.get('api/sections')).data

    return data.data
}

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

export const createMainSection = async (values: MainSection): Promise<MainSection> => {
    const data = (await axiosInstance.post('api/main-section', values)).data;

    return data.data;
}

export const createSection = async (values:any) => {
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
        if (key === "uploadFile") {
            // Если это файл или список файлов
            values[key].fileList.forEach((file: any) => {
                formData.append("uploadFile", file.originFileObj || file);
            });
        } else {
            // Остальные значения
            formData.append(key, values[key]);
        }
    });

    return await(await axiosInstance.post('api/sections', formData)).data
}