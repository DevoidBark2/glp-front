import { action, makeAutoObservable } from "mobx";
import { notification } from "antd";
import {NomenclatureItem} from "@/shared/api/nomenclature/model";
import {createCategory, deleteCategory, getAllCategory, updateCategory} from "@/shared/api/nomenclature";

class NomenclatureStore {
    constructor() {
        makeAutoObservable(this)
    }

    categories: NomenclatureItem[] = [];
    loadingCategories: boolean = false;
    createCategoryModal: boolean = false;
    changeCategoryModal: boolean = false;
    selectedCategory: NomenclatureItem | null = null;

    setSelectedCategory = action((item: NomenclatureItem | null) => {
        this.setChangeCategoryModal(true)
        this.selectedCategory = item;
    })
    setChangeCategoryModal = action((value: boolean) => {
        this.changeCategoryModal = value
    })

    setCreateCategoryModal = action((value: boolean) => {
        this.createCategoryModal = value;
    })

    setLoadingCategories = action((value: boolean) => {
        this.loadingCategories = value;
    })

    getCategories = action(async () => {
        this.setLoadingCategories(true)
        await getAllCategory().then((response) => {
            this.categories = response.map(this.categoryMapper)
        }).finally(() => {
            this.setLoadingCategories(false)
        });
    })

    createCategory = action(async (values: NomenclatureItem) => {
        await createCategory(values).then((response) => {
            this.categories = [...this.categories, response.data.category]
            notification.success({ message: response.data.message })
            this.setCreateCategoryModal(false)
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        })
    })

    changeCategory = action(async (values: NomenclatureItem) => {
        if(values.name === this.selectedCategory?.name) return;

        await updateCategory({ ...values }).then(response => {
            notification.success({ message: response.data.message })
            this.categories = this.categories.map((category) =>
                category.id === values.id ? { ...category, name: values.name } : category
            );
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        })
    })

    deleteCategory = action(async (id: number) => {
        await deleteCategory(id).then(response => {
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