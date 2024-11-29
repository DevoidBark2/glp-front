import { CourseComponentTypeI } from "../course/model";
import { axiosInstance, withAuth } from "../http-client";

export const handleCheckUserTask = withAuth(async (task: CourseComponentTypeI,answers: number[],config = {}) => {
    const data = (await axiosInstance.post('api/save-task-user',{
        task: task,
        answers: answers
    },config)).data;

    return data.data;
})