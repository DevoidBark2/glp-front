import { makeAutoObservable } from "mobx";

class StatisticsStore {
    constructor(){
        makeAutoObservable(this)
    }
}


export default StatisticsStore