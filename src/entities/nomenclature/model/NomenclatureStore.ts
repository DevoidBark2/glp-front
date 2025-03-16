import { action, makeAutoObservable } from "mobx";
import { notification } from "antd";

import { NomenclatureItem } from "@/shared/api/nomenclature/model";
import { createCategory, deleteCategory, getAllCategory, getTeachers, updateCategory } from "@/shared/api/nomenclature";
import { User } from "@/shared/api/user/model";
import { usersMapper } from "@/entities/user/mappers";
import {categoryMapper} from "@/entities/nomenclature";

class NomenclatureStore {
    constructor() {
        makeAutoObservable(this)
    }

    categories: NomenclatureItem[] = [];
    teachers: User[] = []
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

    setCategories = action((categories: NomenclatureItem[]) => {
        this.categories = categories;
    })

    setTeachers = action((teachers: User[]) => {
        this.teachers = teachers;
    })

    getCategories = action(async () => {
        this.setLoadingCategories(true)
        await getAllCategory().then((response) => {
            this.setCategories(response.map(categoryMapper))
        }).finally(() => {
            this.setLoadingCategories(false)
        });
    })

    createCategory = action(async (values: NomenclatureItem) => {
        await createCategory(values).then((response) => {
            this.categories = [...this.categories, response.data.category]
            notification.success({ message: response.data.message })
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        }).finally(() => {
            this.setCreateCategoryModal(false)
        })
    })

    changeCategory = action(async (values: NomenclatureItem) => {
        if (values.name === this.selectedCategory?.name) {return;}

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

    getTeachers = action(async () => {
        await getTeachers().then(response => {
            this.setTeachers(response.map(usersMapper))
        });
    })
}

export default NomenclatureStore;