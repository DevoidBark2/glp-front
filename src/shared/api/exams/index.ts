import { CourseComponentTypeI } from "@/shared/api/course/model";

import { axiosInstance } from "../http-client"

export const getUserExams = async () => {
    const data = (await axiosInstance.get('api/exams')).data

    return data.data;
}

export const createExam = async (title: string, components: CourseComponentTypeI[]) => (await axiosInstance.post('api/exams', {
        title: title,
        components: components
    })).data

export const changeExam = async (examId:number, title: string, components: CourseComponentTypeI[]) => (await axiosInstance.put(`api/exams/${examId}`, {
        title: title,
        components: components
    })).data

export const deleteExam = async (id: number) => (await axiosInstance.delete(`api/exams/${id}`)).data

export const setExamForCourse = async (examId: number, courseId: number) => {
    const data = (await axiosInstance.put('api/set-exam-course', {
        examId: examId,
        courseId: courseId
    }))

    return data.data
}

export const getExamById = async (id: number) => {
    const data = await (axiosInstance.get(`/api/exams/${id}`))
    return data.data
}