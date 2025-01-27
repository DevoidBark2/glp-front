import { axiosInstance } from "../http-client"
import {CourseComponentTypeI} from "@/shared/api/course/model";

export const getUserExams = async () => {
    const data = (await axiosInstance.get('api/exams')).data

    return data.data;
}

export const createExam = async (title: string, components: CourseComponentTypeI[]) => {
    return (await axiosInstance.post('api/exams',{
        title: title,
        components: components
    })).data
}

export const deleteExam = async (id: number) => {
    return (await axiosInstance.delete(`api/exams/${id}`)).data
}