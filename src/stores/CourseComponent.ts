import {action, makeAutoObservable} from "mobx";
import {CourseComponentType} from "@/enums/CourseComponentType";
import {GET, POST} from "@/lib/fetcher";
import {getUserToken} from "@/lib/users";
import dayjs from "dayjs";
import {StatusComponentTaskEnum} from "@/enums/StatusComponentTaskEnum";
import {notification} from "antd";

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
    status: StatusComponentTaskEnum
    tags: string[]
    created_at: Date
}
class CourseComponent {
    constructor() {
        makeAutoObservable(this)
    }

    courseComponents: CourseComponentTypeI[] = []

    addComponentCourse = action(async (values: CourseComponentTypeI) => {
        const token = getUserToken();
        await POST(`/api/component-task?token=${token}`, values).then(response => {
            this.courseComponents = [...this.courseComponents, componentTaskMapper(response.response.data.component)]
        }).catch(e => {
            notification.error({message: e.response.data.message})
        })
    })

    getAllComponent = action(async () => {
        const token = getUserToken()
        await GET(`/api/component-task?token=${token}`).then(response => {
            this.courseComponents = response.response.data.map(componentTaskMapper)
        })
    })

    changeComponent = action(async (values) => {
        debugger
    })
}

const componentTaskMapper = (state: CourseComponentTypeI) => {
   const component: CourseComponentTypeI = {
        id: state.id,
        description: state.description,
        questions: state.questions,
        type: state.type,
        content_description: state.content_description,
        title: state.title,
        status: state.status,
        tags: state.tags,
        created_at: dayjs(state.created_at).format('YYYY-MM-DD HH:mm')
    }

    return component;
}

export default CourseComponent