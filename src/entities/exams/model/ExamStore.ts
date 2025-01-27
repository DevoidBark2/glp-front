import { createExam, deleteExam, getUserExams, setExamForCourse } from "@/shared/api/exams";
import { Exam } from "@/shared/api/exams/model";
import { action, makeAutoObservable } from "mobx";
import { examMapper } from "../mappers";
import { CourseComponentTypeI } from "@/shared/api/course/model";

class ExamStore {
    constructor() {
        makeAutoObservable(this)
    }

    exams: Exam[] = []


    getUserExams = action(async () => {
        const data = await getUserExams();
        this.exams = data.map(examMapper)
    })

    createExam = action(async (title: string, components: CourseComponentTypeI[]) => {
        return await createExam(title, components)
    })

    deleteExam = action(async (id: number) => {
        const data = await deleteExam(id);
        this.exams = this.exams.filter(exam => exam.id !== id);
        return data
    })

    setExamForCourse = action(async (examId: number, courseId: number) => {
        return await setExamForCourse(examId, courseId)
    })
}

export default ExamStore