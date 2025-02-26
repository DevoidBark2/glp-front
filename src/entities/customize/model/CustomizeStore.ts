import { action, makeAutoObservable } from "mobx";
import axios from "axios";
import { Categories, Effect, Frame, Icon } from "@/shared/api/customize/model";
import { getAllEffects, getAllFrames, getAllIcons } from "@/shared/api/customize";

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
}

export default CustomizeStore;
