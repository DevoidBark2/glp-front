import { action, makeAutoObservable } from "mobx";
import { GET, POST, PUT } from "@/lib/fetcher";
import { getUserToken } from "@/lib/users";
import { notification } from "antd";
import { Course, courseMapper } from "@/stores/CourseStore";

export type NomenclatureItem = {
    id: number;
    name: string;
}

class NomenclatureStore {
    constructor() {
        makeAutoObservable(this)
    }

    categories: NomenclatureItem[] = [];
    loadingCategories: boolean = false;
    createCategoryModal: boolean = false;
    preDeleteCategoryModal: boolean = false;
    preDeleteCourseList: Course[] = [];

    setPreDeleteCategoryModal = action((value: boolean) => {
        this.preDeleteCategoryModal = value;
    })

    setCreateCategoryModal = action((value: boolean) => {
        this.createCategoryModal = value;
    })

    setLoadingCategories = action((value: boolean) => {
        this.loadingCategories = value;
    })

    getCategories = action(async () => {
        this.setLoadingCategories(true)
        await GET(`/api/categories`).then(response => {
            this.categories = response.data.map(this.categoryMapper)
        }).catch().finally(() => {
            this.setLoadingCategories(false)
        })
    })

    isPossibleDeleteCategory = action(async (id: number) => {
        this.preDeleteCourseList = [];
        await POST(`/api/possible-delete-category`, { id }).then(response => {
            this.preDeleteCourseList = response.response.data.data.map(courseMapper)
            this.setPreDeleteCategoryModal(true)
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        }).finally(() => { })
    })

    createCategory = action(async (values: NomenclatureItem) => {
        return await POST(`/api/categories`, values).then(response => {
            this.categories = [...this.categories, response.data.category]
            notification.success({ message: response.data.message })
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        }).finally(() => {
            this.setCreateCategoryModal(false)
        })
    })

    handleChangeCategoryName = action(async (newName: string, values: NomenclatureItem) => {
        if (newName === values.name) return;
        await PUT(`/api/categories`, { ...values, ...{ name: newName } }).then(response => {
            notification.success({ message: response.data.message })
        }).catch(e => {
            notification.warning({ message: e.response.data.result.response.message[0] })
        })
    })

    categoryMapper = (item: NomenclatureItem) => {
        return {
            id: item.id,
            name: item.name
        }
    }
}

export default NomenclatureStore;