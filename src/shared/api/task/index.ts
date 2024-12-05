import { CourseComponentTypeI } from "../course/model";
import { axiosInstance, withAuth } from "../http-client";
import { TaskAnswerUserDto } from "./model";

export const handleCheckUserTask = withAuth(async (task: TaskAnswerUserDto,config = {}) => {
    const data = (await axiosInstance.post('api/save-task-user',{
        task: task.task,
        answers: task.answers
    },config)).data;

    return data.data;
})