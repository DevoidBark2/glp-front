import { axiosInstance } from "@/shared/api/http-client";
import { NomenclatureItem } from "@/shared/api/nomenclature/model";
import {User} from "@/shared/api/user/model";

export const getAllCategory = async (): Promise<NomenclatureItem[]> => {
    const data = (await axiosInstance.get('/api/category')).data;

    return data.data;
}

export const createCategory = async (values: NomenclatureItem): Promise<{data: {category: NomenclatureItem, message: string}}> => (await axiosInstance.post('/api/category', values)).data

export const updateCategory = async (values: NomenclatureItem): Promise<{data: {message: string}}> => (await axiosInstance.put('/api/category', values)).data

export const deleteCategory = async (id: number): Promise<{data: {message: string}}> => (await axiosInstance.delete(`/api/category?id=${id}`)).data

export const getTeachers = async (): Promise<User[]> => {
    const data = (await axiosInstance.get('/api/get-teachers')).data

    return data.data
}