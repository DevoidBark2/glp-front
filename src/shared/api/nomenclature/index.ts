import { axiosInstance } from "@/shared/api/http-client";
import { NomenclatureItem } from "@/shared/api/nomenclature/model";

export const getAllCategory = async () => {
    const data = (await axiosInstance.get('/api/category')).data;

    return data.data;
}

export const createCategory = async (values: NomenclatureItem) => {
    return (await axiosInstance.post('/api/category', values)).data;
}

export const updateCategory = async (values: NomenclatureItem) => {
    return (await axiosInstance.put('/api/category', values)).data;
}

export const deleteCategory = async (id: number) => {
    return (await axiosInstance.delete(`/api/category?id=${id}`)).data;
}

export const getTeachers = async () => {
    const data = (await axiosInstance.get('/api/get-teachers')).data

    return data.data
}