import { Exam } from "@/shared/api/exams/model";

export const examMapper = (exam: Exam): Exam => {
    return {
        id: exam.id,
        title: exam.title,
        components: exam.components,
        status: exam.status,
        user: exam.user,
        created_at: exam.created_at
    }
} 