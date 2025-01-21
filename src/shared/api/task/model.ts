import { CourseComponentTypeI } from "../course/model"

export type TaskAnswerUserDto = {
    task: CourseComponentTypeI,
    answers: number[] | string,
    currentSection: number
}

export type CurrentSectionDto = {
    courseId: number,
    currentSection: number
}