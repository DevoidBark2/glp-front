import { axiosInstance, withAuth } from "@/shared/api/http-client";
import { NomenclatureItem } from "@/shared/api/nomenclature/model";

export const getAllCategory = async () => {
    const data = (await axiosInstance.get('/api/category')).data;

    return data.data;
}

export const createCategory = withAuth(async (values: NomenclatureItem, config = {}) => {
    return (await axiosInstance.post('/api/category', values, config)).data;
})

export const updateCategory = withAuth(async (values: NomenclatureItem, config = {}) => {
    return (await axiosInstance.put('/api/category', values, config)).data;
})

export const deleteCategory = withAuth(async (id: number, config = {}) => {
    return (await axiosInstance.delete(`/api/category?id=${id}`, config)).data;
})

export const getTeachers = async () => {
    const data = (await axiosInstance.get('/api/get-teachers')).data

    return data.data
}