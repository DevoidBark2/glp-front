import React from "react";
import { PostStore } from "@/entities/post";
import { CourseStore } from "@/entities/course";
import { FaqStore } from "@/entities/faq";
import { AuthStore } from "@/entities/auth";
import { GeneralSettings } from "@/entities/general-settings";
import UserProfileStore from "@/entities/user-profile/model/UserProfileStore";
import UserStore from "@/entities/user/model/UserStore";
import StatisticsStore from "@/entities/statistics/model/StatisticsStore";
import CommentsStore from "@/entities/comments/model/CommentsStore";
import { ExamStore } from "@/entities/exams";

const userStore = new UserStore();
const postStore = new PostStore();
const courseStore = new CourseStore();
const faqStore = new FaqStore();
const authStore = new AuthStore();
const generalStore = new GeneralSettings();
const userProfileStore = new UserProfileStore();
const statisticsStore = new StatisticsStore();
const commentsStore = new CommentsStore();
const examStore = new ExamStore();

export const RootStore = {
    userStore,
    postStore,
    courseStore,
    faqStore,
    authStore,
    generalStore,
    userProfileStore,
    statisticsStore,
    commentsStore,
    examStore
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
