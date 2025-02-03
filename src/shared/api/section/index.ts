import { axiosInstance } from "../http-client";
import {MainSection} from "@/shared/api/section/model";

export const getCPAllSection = async () => {
    const data = (await axiosInstance.get('api/sections')).data

    return data.data
}

export const deleteSectionCourse = async (id: number) => {
    return (await axiosInstance.delete(`api/sections/${id}`)).data;
}

export const getSectionCourseById = async (id: number) => {
    const data = (await axiosInstance.get(`api/sections/${id}`)).data;

    return data.data;
}

export const createMainCourseSection = async (mainSection: MainSection) => {
    const data = (await axiosInstance.post('api/main-section',mainSection)).data;

    return data.data;
}

export const getMainCourseSection = async (id: number) => {
    const data = (await axiosInstance.get('api/main-section')).data;

    return data.data;
}

export const createMainSection = async (values: MainSection) => {
    return (await axiosInstance.post('api/main-section', values)).data;
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