import { action, makeAutoObservable } from "mobx";
import { User } from "@/stores/UserStore";
import SectionCourse from "@/stores/SectionCourse";
import { Post } from "@/stores/PostStore";
import { GET } from "@/lib/fetcher";
import { getUserToken } from "@/lib/users";
import { Course } from "@/shared/api/course/model";

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
    resultGlobalSearch: ResultSearchItems[] = [];
    searchGlobalText: string = "";
    visibleResultModal: boolean = false;
    statisticsData: StatisticsData | null = null;

    setLoadingStatisticsData = action((value: boolean) => {
        this.loadingStatisticsData = value;
    })

    setVisibleResultModal = action((value: boolean) => {
        this.visibleResultModal = value;
    })

    setSearchGlobalText = action(async (value: string) => {
        this.searchGlobalText = value;
        if (value === "") {
            this.setVisibleResultModal(false);
            this.resultGlobalSearch = [];
            return;
        }
        this.setVisibleResultModal(true);
        const token = getUserToken();
        await GET(`/api/global-search?token=${token}&text=${value}`).then(response => {
            this.resultGlobalSearch = globalSearchMapper(response.response.data);
        }).catch(e => { })
    })

    getAllStatisticsData = action(async () => {
        this.setLoadingStatisticsData(true)
        await GET(`/api/statistics`).then(response => {
            this.statisticsData = response.response.data as StatisticsData;
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