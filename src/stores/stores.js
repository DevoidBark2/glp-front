import React from "react";
import UserStore from "./UserStore";
import PostStore from "@/stores/PostStore";
import SettingsStore from "@/stores/SettingsStore";
import CourseStore from "@/stores/CourseStore";
import GraphStore from "@/stores/GraphStore";
import NomenclatureStore from "@/stores/NomenclatureStore";
import EventStore from "@/stores/EventStore";
import {GeneralSettings} from "@/stores/GeneralSettings";
import CourseComponent from "@/stores/CourseComponent";

const userStore = new UserStore();
const postStore = new PostStore();
const settingsStore = new SettingsStore();
const courseStore = new CourseStore();
const graphStore = new GraphStore();
const nomenclatureStore = new NomenclatureStore();
const eventStore = new EventStore();
const generalSettingsStore = new GeneralSettings();
const courseComponentStore = new CourseComponent();

export const RootStore = {
    userStore,
    postStore,
    settingsStore,
    courseStore,
    graphStore,
    nomenclatureStore,
    eventStore,
    generalSettingsStore,
    courseComponentStore
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

