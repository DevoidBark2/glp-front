import { makeAutoObservable } from "mobx";

class ModelStore {
    constructor() {
        makeAutoObservable(this)
    }


    categories = []
}

export default ModelStore