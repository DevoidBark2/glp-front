import { CourseComponentTypeI } from "../course/model";
import { axiosInstance, withAuth } from "../http-client";
import { CurrentSectionDto, TaskAnswerUserDto } from "./model";

export const handleCheckUserTask = withAuth(async (task: TaskAnswerUserDto, config = {}) => {
    const data = (await axiosInstance.post('api/save-task-user', {
        task: task.task,
        answers: task.answers,
        currentSection: task.currentSection
    }, config)).data;

    return data.data;
})


export const handleUpdateSectionConfirmed = withAuth(async (prevSection: number, config = {}) => {
    const data = (await axiosInstance.post('api/update-step', {
        prevSection: prevSection
    }, config)).data;

    return data.data;
})


export const getCurrentSection = withAuth(async (currentSection: CurrentSectionDto, config = {}) => {
    const data = (await axiosInstance.get(`api/get-current-section?courseId=${currentSection.courseId}&currentSection=${currentSection.currentSection}`, config)).data;

    return data;
})