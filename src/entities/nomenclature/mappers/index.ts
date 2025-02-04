import {NomenclatureItem} from "@/shared/api/nomenclature/model";

export const categoryMapper = (item: NomenclatureItem) => {
    return {
        id: item.id,
        name: item.name
    }
}