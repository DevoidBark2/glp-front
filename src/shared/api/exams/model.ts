import { CourseComponentTypeI } from "../course/model"
import { User } from "../user/model"

export type Exam = {
    id: number,
    title: string,
    components: CourseComponentTypeI[]
    status: ExamStatus
    user: User
    created_at: Date
}

export enum ExamStatus {
    ACTIVE = "active",
    DEACTIVED = "deactived"
}