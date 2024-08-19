import {action, makeAutoObservable} from "mobx";
import {CourseComponentType} from "@/enums/CourseComponentType";
import {GET, POST} from "@/lib/fetcher";
import {getUserToken} from "@/lib/users";

export type QuestionsType = {
    question: string;
    options: string[];
    correctOption: number
}
export type CourseComponentTypeI = {
    id: number;
    title: string;
    description: string;
    type: CourseComponentType
    questions: QuestionsType[]
    content_description: string
}
class CourseComponent {
    constructor() {
        makeAutoObservable(this)
    }

    courseComponents: CourseComponentTypeI[] = []

    addComponentCourse = action(async (values: CourseComponentTypeI) => {
        const token = getUserToken();
        await POST(`/api/component-task?token=${token}`, values).then(response => {
            this.courseComponents = [...this.courseComponents, response.response.data.component]
        }).catch(e => {
            debugger
        })
    })

    getAllComponent = action(async () => {
        const token = getUserToken()
        await GET(`/api/component-task?token=${token}`).then(response => {
            debugger
            this.courseComponents = response.response.data.map(componentTaskMapper)
        })
    })
}

const componentTaskMapper = (state: CourseComponentTypeI) => {
    debugger
    return {
        id: state.id,
        type: state.type,
        title: state.title
    }
}

export default CourseComponent