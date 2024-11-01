import React from "react";
import PostStore from "@/stores/PostStore";
import SettingsStore from "@/stores/SettingsStore";
import CourseStore from "@/stores/CourseStore";
import GraphStore from "@/stores/GraphStore";
import NomenclatureStore from "@/stores/NomenclatureStore";
import EventStore from "@/stores/EventStore";
import { GeneralSettings } from "@/stores/GeneralSettings";
import CourseComponent from "@/stores/CourseComponent";
import SectionCourse from "@/stores/SectionCourse";
import StatisticsStore from "@/stores/statisticsStore";
import AvatarIconsStore from "@/stores/AvatarIconsStore";
import UserProfileStore from "./UserProfileStore";
import FeedBacksStore from "./FeedBacksStore";
import AchievementsStore from "./AchievementsStore";
import ModeratorStore from "./ModeratorStore";
import UserStore from "./UserStore";

const userStore = new UserStore();
const postStore = new PostStore();
const settingsStore = new SettingsStore();
const courseStore = new CourseStore();
const graphStore = new GraphStore();
const nomenclatureStore = new NomenclatureStore();
const eventStore = new EventStore();
const generalSettingsStore = new GeneralSettings();
const courseComponentStore = new CourseComponent();
const sectionCourseStore = new SectionCourse();
const avatarIconsStore = new AvatarIconsStore();
const userProfileStore = new UserProfileStore();
const feedBacksStore = new FeedBacksStore();
const statisticsStore = new StatisticsStore();
const achievementsStore = new AchievementsStore();
const moderatorStore = new ModeratorStore();

export const RootStore = {
    userStore,
    postStore,
    settingsStore,
    courseStore,
    graphStore,
    nomenclatureStore,
    eventStore,
    generalSettingsStore,
    courseComponentStore,
    sectionCourseStore,
    statisticsStore,
    avatarIconsStore,
    userProfileStore,
    feedBacksStore,
    achievementsStore,
    moderatorStore,
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

