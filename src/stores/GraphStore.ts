import {action, makeAutoObservable} from "mobx";

class GraphStore{
    constructor() {
        makeAutoObservable(this)
    }

    visibleMenu: boolean = false;

    setVisibleMenu = action((value:boolean) => {
        this.visibleMenu = value;
    })
}


export default GraphStore;