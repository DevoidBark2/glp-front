import React from "react";
import { PostStore } from "@/entities/post";
import { CourseStore } from "@/entities/course";
import { FaqStore } from "@/entities/faq";
import { AuthStore } from "@/entities/auth";
import {GeneralSettings} from "@/entities/general-settings";

const postStore = new PostStore();
const courseStore = new CourseStore();
const faqStore = new FaqStore();
const authStore = new AuthStore();
const generalStore = new GeneralSettings();

export const RootStore = {
    postStore,
    courseStore,
    faqStore,
    authStore,
    generalStore
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
