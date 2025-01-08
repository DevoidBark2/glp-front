import { axiosInstance, withAuth } from "../http-client"
import { Faq } from "./model";

export const getAllFaq = async (): Promise<Faq[]> => {
    const data = (await axiosInstance.get('api/faq')).data;

    return data.data;
}

export const createFaq = withAuth(async (faq: Faq, config = {}) => {
    return (await axiosInstance.post('api/faq', faq, config)).data;
})

export const deleteFaq = withAuth(async (id: number, config = {}) => {
    const data = (await axiosInstance.delete(`api/faq?id=${id}`, config)).data;

    return data.data;
})

export const getFaqById = (async (id: number) => {
    const data = (await axiosInstance.get(`api/faq/${id}`)).data

    return data.data
})

export const updateFaq = withAuth(async (faq: Faq, config = {}) => {
    return (await axiosInstance.patch('api/faq', faq, config)).data;
})