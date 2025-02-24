import { Achievement } from "@/entities/achievements/model/AchievementsStore";
import { axiosInstance } from "../http-client"

export const getAllAchievements = async (): Promise<Achievement[]> => {
    const data = (await axiosInstance.get('/api/achievements')).data

    return data.data;
}