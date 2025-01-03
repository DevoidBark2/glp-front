import { action, makeAutoObservable, runInAction } from "mobx";
import { DELETE, GET, POST, PUT } from "@/lib/fetcher";
import { getUserToken } from "@/lib/users";
import dayjs from "dayjs";
import { notification } from "antd";
import { CourseComponentType, CourseComponentTypeI } from "@/shared/api/course/model";
import { getAllComponents, StatusComponentTaskEnum } from "@/shared/api/component-task";
import { getComponentTask } from "@/shared/api/component";
import { handleCheckUserTask } from "@/shared/api/task";
import { TaskAnswerUserDto } from "@/shared/api/task/model";

export type QuestionsType = {
    question: string;
    options: string[];
    correctOption: number[]
}

class CourseComponent {
    constructor() {
        makeAutoObservable(this)
    }

    loadingCourseComponent: boolean = false;
    courseComponents: CourseComponentTypeI[] = []
    searchResults: CourseComponentTypeI[] = [];
    selectedComponents: CourseComponentTypeI[] = [];


    setSearchResult = action((value: CourseComponentTypeI[]) => {
        this.searchResults = value;
    })

    setSelectedComponent = action((value: CourseComponentTypeI[]) => {
        this.selectedComponents = value
    })
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
        await getAllComponents().then(response => {
            this.courseComponents = response.map(componentTaskMapper)
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

    getComponentById = action(async (id: number) => {
        return await getComponentTask(id);
    })
}

const componentTaskMapper = (state: CourseComponentTypeI) => {
    const component: any = {
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