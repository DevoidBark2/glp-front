import {ComponentTask} from "@/shared/api/course/model";

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
    sort?: number;
    componentTask: ComponentTask
};

