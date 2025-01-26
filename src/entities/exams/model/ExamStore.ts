import { getUserExams } from "@/shared/api/exams";
import { Exam } from "@/shared/api/exams/model";
import { action, makeAutoObservable } from "mobx";
import { examMapper } from "../mappers";

class ExamStore {
    constructor() {
        makeAutoObservable(this)
    }

    exams: Exam[] = []


    getUserExams = action(async () => {
        const data = await getUserExams();
        this.exams = data.map(examMapper)
    })
}

export default ExamStore