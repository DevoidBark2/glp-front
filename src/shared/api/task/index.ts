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


export const handleUpdateSectionConfirmed = async (prevSection: number) => {
    const data = (await axiosInstance.post('api/update-step', {
        prevSection: prevSection
    })).data;

    return data.data;
}


export const getCurrentSection = async (currentSection: CurrentSectionDto) => {
    return (await axiosInstance.get(`api/get-current-section?courseId=${currentSection.courseId}&currentSection=${currentSection.currentSection}`)).data;
}