import { StatusSectionEnum } from "../section/model";
import { User } from "../user/model";
import {CourseComponentType, QuestionsType, StatusCourseComponentEnum} from "@/shared/api/component/model";

type Category = {
    id: number;
    name: string
}

export enum StatusCourseEnum {
    NEW = 'new',
    ACTIVE = 'active',
    CLOSED = 'closed',
    IN_PROCESSING = 'in_processing',
    REJECTED = 'rejected',
}

export const statusLabels: Record<StatusCourseEnum, string> = {
    [StatusCourseEnum.NEW]: "Новый",
    [StatusCourseEnum.ACTIVE]: "Активный",
    [StatusCourseEnum.CLOSED]: "Закрыт",
    [StatusCourseEnum.IN_PROCESSING]: "В обработке",
    [StatusCourseEnum.REJECTED]: "Отклонен",
};

export enum AccessRightEnum {
    PUBLIC = 0,
    PRIVATE = 1
}

export enum LevelCourseEnum {
    LIGHT = 1,
    MIDDLE = 2,
    HARD = 3
}

export type SectionCourseItem = {
    id: number;
    name: string;
    description: string;
    externalLinks: string[];
    course: Course;
    uploadFile: File[];
    components: CourseComponentTypeI[];
    status: StatusSectionEnum
    created_at: Date
    user: User
    children: any;
}

export type ComponentTask = {
    id: string;
    sort: number
    title: string;
    componentTask: any
    description: string;
    type: CourseComponentType
    questions: QuestionsType[]
    content_description: string
    status: StatusCourseComponentEnum
    tags: string[]
    created_at: Date
    user: User
    userAnswer?: UserAnswer
}

export type CourseComponentTypeI = {
    id: string;
    sort: number
    componentTask: ComponentTask
}

export type QuizAnswer = {
    id: string
    question: string
    userAnswer: number,
    isCorrect: boolean
}

export type SimpleTaskAnswer = {
    id: string
    question: string;
    userAnswer: number,
    isCorrect: boolean
}

export type MultiQuizTaskAnswer = {
    id: string
    question: string
    userAnswer: number[],
    isCorrect: boolean
}

export type UserAnswer = {
    id: number;
    taskType: CourseComponentType
    answer: QuizAnswer[] | SimpleTaskAnswer[] | MultiQuizTaskAnswer[]
}



export type Course = {
    id: number;
    courseId: number;
    name: string;
    image: string;
    category: Category;
    access_right: number;
    level: number;
    small_description: string;
    content_description: string;
    duration: number
    publish_date: Date
    created_at: Date
    user: User
    status: StatusCourseEnum
    sections: SectionCourseItem[]
    courseUsers: any
    progress: any
    enrolledAt: Date
    children: any
    isUserEnrolled: boolean
}


export type CourseMember = {
    id: number,
    enrolledAt: Date
    progress: number,
    user: User,
}

export type CourseReview = {
    rating: number
    review: string
    courseId: number
}

export type SectionMenu = {
    id: number
    name: string
    userAnswer: UserAnswer
}
export type MainSectionMenu = {
    id: number
    name: string
    children: SectionMenu[]
}

export type CourseMenu = {
    courseName: string,
    progress: number,
    sections: MainSectionMenu[],
}