import {Course, CourseComponentTypeI} from "../course/model";
import {User} from "@/shared/api/user/model";

export enum StatusSectionEnum {
    ACTIVE = 'active',
    DEACTIVE = 'deactive',
}


export type FileSectionType = {
    filePath: string;
    fileName: string;
}

export type SectionCourse = {
    id: number;
    name: string;
    small_description:string,
    components: CourseComponentTypeI[],
    sections: any
    files: FileSectionType[],
    links: string[],
}

export type SectionCourseItem = {
    id: number;
    name: string;
    description: string;
    externalLinks: string[];
    course: Course;
    uploadFile: File[];
    components: CourseComponentTypeI[];
    user: User
    status: StatusSectionEnum;
    sectionComponents: any
    created_at: Date
}


export type MainSection = {
    id: number;
    title: string;
}
