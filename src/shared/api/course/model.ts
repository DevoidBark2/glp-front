import { StatusComponentTaskEnum } from "../component-task";
import { StatusSectionEnum } from "../section/model";
import { User } from "../user/model";

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

export enum CourseComponentType {
    Text = "text",
    Quiz = "quiz",
    Coding = "coding",
    MultiPlayChoice = "multiple-choice",
    Matching = "matching",
    Sequencing = "sequencing",
    SimpleTask = "simple-task"
}

export type CourseComponentTypeI = {
    id: number;
    title: string;
    description: string;
    type: CourseComponentType
    questions: QuestionsType[]
    content_description: string
    status: StatusComponentTaskEnum
    componentTask: any
    tags: string[]
    created_at: Date
    user: User
    userAnswer?: UserAnswer[]
}

export type UserAnswer = {
    id: string;
    correctAnswer: number;
    isCorrect: boolean;
    question: string;
    userAnswer: number
}

export type QuestionsType = {
    question: string;
    options: string[];
    correctOption: number
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
