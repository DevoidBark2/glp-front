import React from "react";
import {PostStore} from "@/entities/post";

const postStore = new PostStore();

export const RootStore = {
    postStore,
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
