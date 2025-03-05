import { axiosInstance } from "../http-client";
import { MainSection, SectionCourseItem } from "@/shared/api/section/model";

export const getCPAllSection = async () => {
    const data = (await axiosInstance.get('api/sections')).data

    return data.data
}

export const deleteSectionCourse = async (id: number) => {
    return (await axiosInstance.delete(`api/sections/${id}`)).data;
}

export const getSectionCourseById = async (id: number): Promise<SectionCourseItem> => {
    const data = (await axiosInstance.get(`api/sections/${id}`)).data;

    return data.data;
}

export const createMainCourseSection = async (mainSection: MainSection) => {
    const data = (await axiosInstance.post('api/main-section', mainSection)).data;

    return data.data;
}

export const getMainCourseSection = async () => {
    const data = (await axiosInstance.get('api/main-section')).data;

    return data.data;
}

export const createMainSection = async (values: MainSection) => {
    return (await axiosInstance.post('api/main-section', values)).data;
}

export const createSection = async (values: SectionCourseItem) => {
    // const formData = new FormData();
    //
    // Object.keys(values).forEach((key) => {
    //     if (key === "uploadFile") {
    //         // Обрабатываем файлы
    //         values[key].fileList.forEach((file: any) => {
    //             formData.append("uploadFile", file.originFileObj || file);
    //         });
    //     } else if (key === "course" || key === "externalLinks" || key === "uploadFile") {
    //         // Преобразуем сложные структуры в JSON-строку
    //         formData.append(key, JSON.stringify(values[key]));
    //     } else {
    //         // Остальные обычные поля
    //         formData.append(key, values[key]);
    //     }
    // });

    return await (await axiosInstance.post('api/sections', values)).data;
};

export const changeSection = async (values: SectionCourseItem): Promise<{ message: string }> => {
    return (await axiosInstance.put('api/sections', values)).data;
}