import {User} from "@/shared/api/user/model";

export enum CourseComponentType {
    Text = "text",
    Quiz = "quiz",
    Coding = "coding",
    MultiPlayChoice = "multiple-choice",
    Matching = "matching",
    Sequencing = "sequencing",
    SimpleTask = "simple-task"
}

export enum StatusCourseComponentEnum {
    ACTIVATED = 'activated',
    DEACTIVATED = 'deactivated',
}


export type QuestionsType = {
    id: string;
    question: string;
    options: string[];
    correctOption: number | number[];
};

export type CourseComponent = {
    id: string;
    title: string;
    status: StatusCourseComponentEnum;
    type: CourseComponentType;
    created_at: Date;
    user?: User;
    sort?: number;
    description?: string;
    questions?: QuestionsType[];
    answer?: string;
    content_description?: string;
};

