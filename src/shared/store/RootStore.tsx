"use client"
import React, { ReactNode } from "react";

// Импортируем сторы
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

// Создаём экземпляры стора
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
const nomenclatureStore = new NomenclatureStore();
const reviewStore = new ReviewStore();
const sectionCourseStore = new SectionStore();
const eventStore = new EventStore();
const userLevelStore = new UserLevelStore();
const customizeStore = new CustomizeStore();

export interface RootStoreType {
    userStore: UserStore;
    postStore: PostStore;
    courseStore: CourseStore;
    faqStore: FaqStore;
    authStore: AuthStore;
    generalSettingsStore: GeneralSettings;
    userProfileStore: UserProfileStore;
    statisticsStore: StatisticsStore;
    commentsStore: CommentsStore;
    courseComponentStore: CourseComponentStore;
    examStore: ExamStore;
    nomenclatureStore: NomenclatureStore;
    reviewStore: ReviewStore;
    sectionCourseStore: SectionStore;
    eventStore: EventStore;
    userLevelStore: UserLevelStore;
    customizeStore: CustomizeStore;
}

export const RootStore: RootStoreType = {
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
    customizeStore,
};

const StoreContext = React.createContext<RootStoreType | undefined>(undefined);

interface StoresProviderProps {
    children: ReactNode;
}

export function StoresProvider({ children }: StoresProviderProps) {
    return <StoreContext.Provider value={RootStore}>{children}</StoreContext.Provider>;
}

export function useMobxStores() {
    const context = React.useContext(StoreContext);
    if (!context) {
        throw new Error("useMobxStores must be used within a StoresProvider");
    }
    return context;
}
