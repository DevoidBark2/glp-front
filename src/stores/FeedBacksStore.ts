import { makeAutoObservable } from "mobx";
import { User } from "./UserStore";

export type FeedBackItem = {
    id: string,
    message: string[],
    user: User,
}

class FeedBacksStore {
    constructor() {
        makeAutoObservable(this);
    }
}

export default FeedBacksStore;