import { axiosInstance } from "../http-client";

import { CurrentSectionDto, TaskAnswerUserDto } from "./model";

export const handleCheckUserTask = async (task: TaskAnswerUserDto, courseId: number) => {
    const data = (await axiosInstance.post('api/save-task-user', {
        task: task.task,
        answers: task.answers,
        currentSection: task.currentSection,
        courseId: courseId
    })).data;

    return data.data;
}


export const handleUpdateSectionConfirmed = async (prevSection: number, courseId: number) => {
    const data = (await axiosInstance.post('api/update-step', {
        prevSection: prevSection,
        courseId: courseId
    })).data;

    return data.data;
}


export const getCurrentSection = async (currentSection: CurrentSectionDto) => (await axiosInstance.get(`api/get-current-section?courseId=${currentSection.courseId}&currentSection=${currentSection.currentSection}`)).data

export const startExam = async (courseId: number) => {
    const data = (await axiosInstance.get(`/api/start-exam?courseId=${courseId}`)).data

    return data.data;
}

export const submitExamUserAnswer = async (courseId: number) => {
    const data = (await axiosInstance.post(`api/submit-exam-user?courseId=${courseId}`)).data

    return data.data;
}