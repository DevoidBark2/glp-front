import React from "react";
import {PostStore} from "@/entities/post";
import { CourseStore } from "@/entities/course";

const postStore = new PostStore();
const courseStore = new CourseStore();

export const RootStore = {
    postStore,
    courseStore
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
