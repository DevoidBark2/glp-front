import { makeAutoObservable } from "mobx";

class SupportStore {
    constructor() {
        makeAutoObservable(this)
    }
}

export default SupportStore;