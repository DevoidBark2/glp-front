import { action, makeAutoObservable } from "mobx";

import { getStatistics } from "@/shared/api/statistics";

export type StatisticsData = {
    countUsers: number;
    courseCount: number;
    courseCountIsProcessing: number;
    courseCountNew: number;
    courseCountPublish: number;
    courseCountReject: number;
    postCount: number;
    postsCountPublish: number;
    postsCountNew: number;
    postsCountIsProcessing: number;
    postsCountReject: number;

}

class StatisticsStore {
    constructor() {
        makeAutoObservable(this)
    }

    loadingStatisticsData: boolean = true;
    statisticsData: StatisticsData | null = null;

    setStatisticsData = action((values: StatisticsData) => {
        this.statisticsData = values;
    })

    setLoadingStatisticsData = action((value: boolean) => {
        this.loadingStatisticsData = value;
    })


    getAllStatisticsData = action(async () => {
        this.setLoadingStatisticsData(true)
        await getStatistics().then(response => {
            this.setStatisticsData(response);
        }).catch(e => { }).finally(() => {
            this.setLoadingStatisticsData(false)
        });
    })
}

export default StatisticsStore;