import { axiosInstance } from "../http-client"

import { Faq } from "./model";

export const getAllFaq = async (): Promise<Faq[]> => {
    const data = (await axiosInstance.get('api/faq')).data;

    return data.data;
}

export const createFaq = async (faq: Faq) => (await axiosInstance.post('api/faq', faq)).data

export const deleteFaq = async (id: number) => {
    const data = (await axiosInstance.delete(`api/faq?id=${id}`)).data;

    return data.data;
}

export const getFaqById = (async (id: number) => {
    const data = (await axiosInstance.get(`api/faq/${id}`)).data

    return data.data
})

export const updateFaq = async (faq: Faq) => (await axiosInstance.patch('api/faq', faq)).data