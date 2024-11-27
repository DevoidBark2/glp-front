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
    children: any;
}

export enum CourseComponentType {
    Text = "text",
    Quiz = "quiz",
    Coding = "coding",
    MultiPlayChoice = "multiple-choice",
    Matching = "matching",
    Sequencing = "sequencing"
}

export type CourseComponentTypeI = {
    id: number;
    title: string;
    description: string;
    type: CourseComponentType
    questions: QuestionsType[]
    content_description: string
    status: StatusComponentTaskEnum
    tags: string[]
    created_at: Date
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
    user: User
    status: StatusCourseEnum
    sections: SectionCourseItem[]
    courseUsers: any
    progress: any
    enrolledAt: Date
    children: any
}
