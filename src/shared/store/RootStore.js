"use client"
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
import { NomenclatureStore } from "@/entities/nomenclature";
import { ReviewStore } from "@/entities/review";
import { SectionStore } from "@/entities/section";
import { EventStore } from "@/entities/events";
import CourseComponentStore from "@/entities/component-task/model/CourseComponentStore";
import { UserLevelStore } from "@/entities/user-level";
import { CustomizeStore } from "@/entities/customize";

const userStore = new UserStore();
const postStore = new PostStore();
const courseStore = new CourseStore();
const faqStore = new FaqStore();
const authStore = new AuthStore();
const generalSettingsStore = new GeneralSettings();
const userProfileStore = new UserProfileStore();
const statisticsStore = new StatisticsStore();
const commentsStore = new CommentsStore();
const examStore = new ExamStore();
const courseComponentStore = new CourseComponentStore();
const nomenclatureStore = new NomenclatureStore()
const reviewStore = new ReviewStore()
const sectionCourseStore = new SectionStore()
const eventStore = new EventStore()
const userLevelStore = new UserLevelStore()
const customizeStore = new CustomizeStore()

export const RootStore = {
    userStore,
    postStore,
    courseStore,
    faqStore,
    authStore,
    generalSettingsStore,
    userProfileStore,
    statisticsStore,
    commentsStore,
    courseComponentStore,
    examStore,
    nomenclatureStore,
    reviewStore,
    sectionCourseStore,
    eventStore,
    userLevelStore,
    customizeStore
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
