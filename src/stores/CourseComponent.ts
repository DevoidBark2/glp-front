import { action, makeAutoObservable } from "mobx";
import { CourseComponentType } from "@/enums/CourseComponentType";
import { DELETE, GET, POST, PUT } from "@/lib/fetcher";
import { getUserToken } from "@/lib/users";
import dayjs from "dayjs";
import { StatusComponentTaskEnum } from "@/enums/StatusComponentTaskEnum";
import { notification } from "antd";

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

    loadingCourseComponent: boolean = false;
    courseComponents: CourseComponentTypeI[] = []
    searchResults: CourseComponentTypeI[] = [];
    selectedComponents: CourseComponentTypeI[] = [];

    setLoadingCourseComponent = action((value: boolean) => {
        this.loadingCourseComponent = value
    })

    addComponentCourse = action(async (values: CourseComponentTypeI) => {
        await POST(`/api/component-task`, values).then(response => {
            this.courseComponents = [...this.courseComponents, componentTaskMapper(response.data.component)]
            notification.success({ message: response.data.message })
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        })
    })

    getAllComponent = action(async () => {
        this.setLoadingCourseComponent(true)
        const token = getUserToken()
        await GET(`/api/component-task?token=${token}`).then(response => {
            this.courseComponents = response.response.data.map(componentTaskMapper)
        }).finally(() => {
            this.setLoadingCourseComponent(false)
        })
    })

    changeComponent = action(async (values: CourseComponentTypeI) => {
        await PUT(`/api/component-task`, values).then(response => {
            notification.success({ message: response.message })
            const changedComponentIndex = this.courseComponents.findIndex(component => component.id === values.id);
            this.courseComponents[changedComponentIndex] = values;
            this.courseComponents = [...this.courseComponents];
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        })
    })

    deleteComponent = action(async (componentId: number) => {
        const token = getUserToken();
        await DELETE(`/api/component-task?token=${token}&componentId=${componentId}`).then(response => {
            this.courseComponents = this.courseComponents.filter(component => component.id !== componentId);
            notification.success({ message: response.response.message })
        });
    })

    // Метод для выполнения поиска к
    searchComponents = action(async (query: string) => {
        await GET(`/api/search-components?query=${query}`).then(response => {
            this.searchResults = response.data;
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        });
    })

    // Метод для добавления компонента в таблицу
    addComponentToTable = action((component: CourseComponentTypeI) => {
        // Проверяем, что компонент не был добавлен ранее
        const exists = this.selectedComponents.find(item => item.id === component.id);
        if (!exists) {
            this.selectedComponents = [...this.selectedComponents, component];
        }
    })

    // Метод для удаления компонента из таблицы
    removeComponentFromTable(id: number) {
        this.selectedComponents = this.selectedComponents.filter(item => item.id !== id);
    }
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
        created_at: dayjs(state.created_at).toDate()
    }

    return component;
}

export default CourseComponent