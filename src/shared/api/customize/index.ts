import { axiosInstance } from "../http-client"
import { Effect, Frame, Icon } from "./model"

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