import React from "react";
import UserStore from "./UserStore";

const userStore = new UserStore();

export const RootStore = {
    userStore
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

