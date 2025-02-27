import { action, makeAutoObservable } from "mobx";
import { Categories, CustomizeCategoryItem, Effect, Frame, Icon } from "@/shared/api/customize/model";
import { buyItem, getAllEffects, getAllFrames, getAllIcons, selectedCustomizeItem } from "@/shared/api/customize";

class CustomizeStore {
    categories: Categories = {
        frames: [],
        icons: [],
        effects: []
    };

    constructor() {
        makeAutoObservable(this);
    }

    setFrames = action((frames: Frame[]) => {
        this.categories.frames = frames;
    })

    setIcons = action((icons: Icon[]) => {
        this.categories.icons = icons;
    })

    setEffects = action((effects: Effect[]) => {
        this.categories.effects = effects;
    })

    getFrames = action(async () => {
        const response = await getAllFrames();
        this.setFrames(response);
    });

    getIcons = action(async () => {
        const response = await getAllIcons();
        this.setIcons(response);
    });

    getEffects = action(async () => {
        const response = await getAllEffects();
        this.setEffects(response);
    });

    getAllCategories = action(async () => {
        await Promise.all([this.getFrames(), this.getIcons(), this.getEffects()]);
    });

    buyItem = action(async (category: keyof Categories, item: CustomizeCategoryItem) => {
        const data = await buyItem(category, item)

        this.categories = {
            ...this.categories,
            [category]: this.categories[category].map(el => {
                debugger
                return el.id === item.id ? { ...el, isPurchased: true } : el
            }
            )
        };

        return data

    })

    selectItem = action(async (category: keyof Categories, item: CustomizeCategoryItem) => {
        const data = await selectedCustomizeItem(category, item);

        this.categories = {
            ...this.categories,
            [category]: this.categories[category].map(el =>
                el.id === item.id
                    ? { ...el, isActive: true }  // Выбранный элемент активируем
                    : category === 'frames' || category === 'effects'
                        ? { ...el, isActive: false } // Остальные отключаем (только для frames и effects)
                        : el
            )
        };

        return data;
    });
}

export default CustomizeStore;
