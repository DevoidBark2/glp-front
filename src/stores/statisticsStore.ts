import { action, makeAutoObservable } from "mobx";
import SectionCourse from "@/stores/SectionCourse";
import { Post } from "@/stores/PostStore";
import { GET } from "@/lib/fetcher";
import { getUserToken } from "@/lib/users";
import { Course } from "@/shared/api/course/model";
import {User} from "@/shared/api/user/model";
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

export type ResultSearchItems = {
    user: User[],
    courses: Course[],
    section: SectionCourse[],
    posts: Post[]
}
class StatisticsStore {
    constructor() {
        makeAutoObservable(this)
    }

    loadingStatisticsData: boolean = true;
    statisticsData: StatisticsData | null = null;

    setLoadingStatisticsData = action((value: boolean) => {
        this.loadingStatisticsData = value;
    })


    getAllStatisticsData = action(async () => {
        this.setLoadingStatisticsData(true)
        await getStatistics().then(response => {
            this.statisticsData = response as StatisticsData;
        }).catch(e => { }).finally(() => {
            this.setLoadingStatisticsData(false)
        });
    })
}

const globalSearchMapper = (result: ResultSearchItems) => {
    const item: ResultSearchItems = {
        user: result.user,
        courses: result.courses,
        section: result.section,
        posts: result.posts,
    }

    return [item];
}

export default StatisticsStore;