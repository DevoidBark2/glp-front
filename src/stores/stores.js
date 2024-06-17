import React from "react";
import UserStore from "./UserStore";
import PostStore from "@/stores/PostStore";

const userStore = new UserStore();
const postStore = new PostStore();

export const RootStore = {
    userStore,
    postStore
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

