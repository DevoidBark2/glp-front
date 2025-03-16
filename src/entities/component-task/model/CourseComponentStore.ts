import { action, makeAutoObservable } from "mobx";
import {notification} from "antd";

import { CourseComponent } from "@/shared/api/component/model";
import {
    changeComponent,
    createComponent,
    deleteComponentById,
    getAllComponents,
    getComponentById,
    searchComponentsByTitle
} from "@/shared/api/component";
import {componentTaskMapper} from "@/entities/component-task";

class CourseComponentStore {
    constructor() {
        makeAutoObservable(this)
    }

    loadingCourseComponent: boolean = false;
    courseComponents: CourseComponent[] = []
    searchResults: CourseComponent[] = [];
    selectedComponents: CourseComponent[] = [];
    createLoading: boolean = false

    setCreateLoading = action((value: boolean) => {
        this.createLoading = value
    })

    setSearchResult = action((value: CourseComponent[]) => {
        this.searchResults = value;
    })

    setSelectedComponent = action((value: CourseComponent[]) => {
        this.selectedComponents = value
    })
    setLoadingCourseComponent = action((value: boolean) => {
        this.loadingCourseComponent = value
    })

    addComponentCourse = action(async (values: CourseComponent) => {
        this.setCreateLoading(true)
        await createComponent(values).then(response => {
            this.courseComponents = [...this.courseComponents, componentTaskMapper(response.component)]
            notification.success({ message: response.message })
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        }).finally(() => {
            this.setCreateLoading(true)
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

    changeComponent = action(async (values: CourseComponent) => {
        await changeComponent(values).then(response => {
            notification.success({ message: response.message })
            const changedComponentIndex = this.courseComponents.findIndex(component => component.id === values.id);
            this.courseComponents[changedComponentIndex] = values;
            this.courseComponents = [...this.courseComponents];
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        })
    })

    deleteComponent = action(async (componentId: string) => {
        await deleteComponentById(componentId).then(response => {
            this.courseComponents = this.courseComponents.filter(component => component.id !== componentId);
            notification.success({ message: response.message })
        });
    })

    searchComponents = action(async (query: string) => {
        await searchComponentsByTitle(query).then(response => {
            this.setSearchResult(response);
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        });
    })

    addComponentToTableForSection = action((component: CourseComponent) => {
        const exists = this.selectedComponents.find(item => item.id === component.id);
        if (!exists) {
            this.selectedComponents = [...this.selectedComponents, component];
        }
    })

    removeComponentFromTable = action(async (id: string) => {
        this.selectedComponents = this.selectedComponents.filter(item => item.id !== id);
    })

    getComponentById = action(async (id: string): Promise<CourseComponent> => {
        this.setLoadingCourseComponent(true)
        return await getComponentById(id).finally(() => {
            this.setLoadingCourseComponent(false)
        });
    })
}

export default CourseComponentStore;