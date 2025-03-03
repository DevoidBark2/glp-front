import { CourseComponent } from "../component/model"
import { User } from "../user/model"

export type Exam = {
    id: number,
    title: string,
    components: CourseComponent[]
    status: ExamStatus
    startExam: Date
    created_at: Date
}

export enum ExamStatus {
    ACTIVE = "active",
    DEACTIVATED = "deactivated"
}