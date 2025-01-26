import { axiosInstance } from "../http-client"

export const getUserExams = async () => {
    const data = (await axiosInstance.get('api/exams')).data

    return data.data;
}