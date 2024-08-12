import React from "react";
import UserStore from "./UserStore";
import PostStore from "@/stores/PostStore";
import SettingsStore from "@/stores/SettingsStore";
import CourseStore from "@/stores/CourseStore";
import GraphStore from "@/stores/GraphStore";
import NomenclatureStore from "@/stores/NomenclatureStore";

const userStore = new UserStore();
const postStore = new PostStore();
const settingsStore = new SettingsStore();
const courseStore = new CourseStore();
const graphStore = new GraphStore();
const nomenclatureStore = new NomenclatureStore();

export const RootStore = {
    userStore,
    postStore,
    settingsStore,
    courseStore,
    graphStore,
    nomenclatureStore
};
const StoreContext = React.createContext(RootStore);

export function StoresProvider(props) {
    return (
        <StoreContext.Provider value={RootStore}>
            {props.children}
        </StoreContext.Provider>
    );
}

export function useMobxStores() {
    return React.useContext(StoreContext);
}

