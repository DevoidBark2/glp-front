import { CourseComponent } from "../component/model"
import { User } from "../user/model"

export type Exam = {
    id: number,
    title: string,
    components: CourseComponent[]
    status: ExamStatus
    exam: ExamBlock
    created_at: Date
}

export type ExamBlock = {
    id: number
    startExamAt: Date
    endExamAt: Date
    isEndExam: boolean,
    progress:number
}

export enum ExamStatus {
    ACTIVE = "active",
    DEACTIVATED = "deactivated"
}