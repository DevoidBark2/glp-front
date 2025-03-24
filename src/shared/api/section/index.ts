import { MainSection, SectionCourseItem } from "@/shared/api/section/model";

import { axiosInstance } from "../http-client";

export const getCPAllSection = async () => {
    const data = (await axiosInstance.get('api/sections')).data

    return data.data
}

export const deleteSectionCourse = async (id: number) => (await axiosInstance.delete(`api/sections/${id}`)).data

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

export const createMainSection = async (values: MainSection) => (await axiosInstance.post('api/main-section', values)).data

export const createSection = async (values: SectionCourseItem) => {
    const formData = new FormData();

    (Object.keys(values) as Array<keyof SectionCourseItem>).forEach((key) => {
        if (key === "uploadFile") {
            const uploadFiles = values[key] as File[];  // Приведение типа
            if (Array.isArray(uploadFiles)) {
                uploadFiles.forEach((file) => {
                    formData.append("uploadFile", file); // Здесь корректно добавляем бинарный файл
                });
            }
        } else if (key === "course" || key === "externalLinks") {
            formData.append(key, JSON.stringify(values[key]));
        } else if (key !== "parentSection") {
            formData.append(key, String(values[key]));
        }
    });

    try {
        const response = await axiosInstance.post('api/sections', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error("Ошибка при создании раздела", error);
        throw error;
    }
};


export const changeSection = async (values: SectionCourseItem): Promise<{ message: string }> => (await axiosInstance.put('api/sections', values)).data