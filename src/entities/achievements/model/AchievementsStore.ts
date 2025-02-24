import { getAllAchievements } from "@/shared/api/achievements";
import { action, makeAutoObservable } from "mobx";

// Определяем enum для типов условий
export enum ConditionTypeEnum {
    COMPLETE_COURSES = "complete_courses",
    COMPLETE_MODULE = "complete_module",
    EARN_POINTS = "earn_points",
    ATTEND_EVENT = "attend_event",
    LOGIN_STREAK = "login_streak",
    COMPLETE_ASSESSMENT = "complete_assessment",
    SUBMIT_ASSIGNMENTS = "submit_assignments",
    MENTOR_STUDENTS = "mentor_students",
    GIVE_FEEDBACK = "give_feedback",
    PARTICIPATE_DISCUSSIONS = "participate_discussions",
    WATCH_VIDEOS = "watch_videos",
    COMPLETE_QUIZ = "complete_quiz",
    EARN_CERTIFICATES = "earn_certificates",
    SHARE_COURSE = "share_course",
    CREATE_COURSE_CONTENT = "create_course_content",
    RECEIVE_UPVOTES = "receive_upvotes",
    ACHIEVE_HIGH_SCORE = "achieve_high_score",
    REFER_FRIENDS = "refer_friends",
    STUDY_HOURS = "study_hours",
    EARN_BADGES = "earn_badges",
    COMPLETE_CHALLENGES = "complete_challenges",
    COLLABORATE_PROJECT = "collaborate_project",
    COURSE_COMPLETION_STREAK = "course_completion_streak",
    TOP_LEARNER = "top_learner",
    ATTEND_WORKSHOPS = "attend_workshops",
    CREATE_DISCUSSION_TOPICS = "create_discussion_topics",
    SOLVE_PRACTICE_PROBLEMS = "solve_practice_problems",
    REVIEW_MATERIALS = "review_materials",
    GET_FEEDBACK_FROM_INSTRUCTOR = "get_feedback_from_instructor",
    EARLY_BIRD = "early_bird",
}

// Определяем enum для типов достижений
export enum AchievementTypeEnum {
    LEARNING = "Обучение",
    POINTS = "Баллы",
    PARTICIPATION = "Участие",
    ACTIVITY = "Активность",
    INTERACTION = "Взаимодействие",
    ACHIEVEMENTS = "Достижения",
    CONTENT_CREATION = "Создание контента",
    REFERRALS = "Рефералы"
}

export type Condition = {
    id: number;
    condition: ConditionTypeEnum;
    title: string;
    type: AchievementTypeEnum;
    description: string
}

// Тип для достижения
export type Achievement = {
    id: string;
    title: string;
    description: string;
    icon: string;
    condition: ConditionTypeEnum;
    targetValue: number;
    progress: number
}

class AchievementsStore {
    constructor() {
        makeAutoObservable(this);
    }
    achievements: Achievement[] = [];
    createLoading: boolean = false;

    setCreateLoading = action((value: boolean) => {
        this.createLoading = value;
    })

    setAchievements = action((achievements: Achievement[]) => {
        this.achievements = achievements
    })

    getAllAchievement = action(async () => {
        const data = await getAllAchievements();

        this.setAchievements(data);
    })

    createAchievements = action(async (value: Achievement) => {

    })

}

export default AchievementsStore;