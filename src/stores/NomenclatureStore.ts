import { action, makeAutoObservable } from "mobx";
import { GET, POST, PUT, DELETE } from "@/lib/fetcher";
import { notification } from "antd";
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
    changeCategoryModal: boolean = false;
    selectedCategory: NomenclatureItem | null = null;

    setSelectedCategory = action((item: NomenclatureItem | null) => {
        this.setChangeCategoryModal(true)
        this.selectedCategory = item;
    })
    setChangeCategoryModal = action((value: boolean) => {
        this.changeCategoryModal = value
    })
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

    createCategory = action(async (values: NomenclatureItem) => {
        return await POST(`/api/categories`, values).then(response => {
            this.categories = [...this.categories, response.data.category]
            notification.success({ message: response.data.message })
            this.setCreateCategoryModal(false)
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        })
    })

    handleChangeCategoryName = action(async (values: NomenclatureItem) => {
        if(values.name === this.selectedCategory?.name) {
            return;
        }
        await PUT(`/api/categories`, { ...values }).then(response => {
            notification.success({ message: response.data.message })
            this.categories = this.categories.map((category) =>
                category.id === values.id ? { ...category, name: values.name } : category
            );
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        })
    })

    deleteCategory = action(async (id: number) => {
        await DELETE(`/api/categories?id=${id}`).then(response => {
            notification.success({ message: response.data.message })
            this.categories = this.categories.filter(category => category.id !== id);
        }).catch(e => {
            notification.error({ message: e.response.data.message })
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