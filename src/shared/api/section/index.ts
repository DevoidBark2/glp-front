import {MainSection, SectionCourseItem} from "@/stores/SectionCourse";
import { axiosInstance, withAuth } from "../http-client";
import {POST} from "@/lib/fetcher";

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

export const createMainSection = withAuth(async (values: MainSection,config = {}): Promise<MainSection> => {
    const data = (await axiosInstance.post('api/main-section', values, config)).data;

    return data.data;
})

export const createSection = withAuth(async (values:any, config = {}) => {

    debugger
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

    return await(await axiosInstance.post('/api/sections', formData, config)).data
})