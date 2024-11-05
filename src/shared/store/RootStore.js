import React from "react";
import { PostStore } from "@/entities/post";
import { CourseStore } from "@/entities/course";
import { FaqStore } from "@/entities/faq";

const postStore = new PostStore();
const courseStore = new CourseStore();
const faqStore = new FaqStore();

export const RootStore = {
    postStore,
    courseStore,
    faqStore
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
