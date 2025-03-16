import {NomenclatureItem} from "@/shared/api/nomenclature/model";

export const categoryMapper = (item: NomenclatureItem) => ({
        id: item.id,
        name: item.name
    })