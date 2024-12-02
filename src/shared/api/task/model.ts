import { CourseComponentTypeI } from "../course/model"

export type TaskAnswerUserDto = {
    task: CourseComponentTypeI,
    answers: number[]
}