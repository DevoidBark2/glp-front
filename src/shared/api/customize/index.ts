import { axiosInstance } from "../http-client"

import {Categories, CustomizeCategoryItem, Effect, Frame, Icon} from "./model"

export const getAllFrames = async (): Promise<Frame[]> => {
    const data = (await (axiosInstance.get('/api/frames'))).data

    return data.data
}

export const getAllEffects = async (): Promise<Effect[]> => {
    const data = (await (axiosInstance.get('/api/effects'))).data

    return data.data
}

export const getAllIcons = async (): Promise<Icon[]> => {
    const data = (await (axiosInstance.get('/api/icons'))).data

    return data.data
}

export const buyItem = async (category: keyof Categories, item: CustomizeCategoryItem): Promise<void> => {
    const data = (await (axiosInstance.post('/api/customize/buy', {
        category: category,
        item: item,
    }))).data

    return data.data
}

export const selectedCustomizeItem = async (category: keyof Categories, item: CustomizeCategoryItem) => {
    const data = (await (axiosInstance.post('/api/customize/selected', {
        category: category,
        item: item,
    }))).data

    return data.data
}