import { axiosInstance } from "../http-client"

export const getStatistics = async () => {
    const data = (await axiosInstance.get('/api/statistics')).data

    return data.data
}