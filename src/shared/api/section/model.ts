import { User } from "@/shared/api/user/model";
import { CourseComponent } from "@/shared/api/component/model";

import {ComponentTask, Course, CourseComponentTypeI} from "../course/model";

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
    small_description: string,
    components: CourseComponent[],
    files: FileSectionType[],
    links: string[],
}

export type ParentSection = {
    id: number;
    title: string;
    sort: number;
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
    sectionComponents: SectionComponentTask[]
    parentSection: ParentSection
    sort: number
    created_at: Date
}

export type SectionComponentTask = {
    id: string;
    sort: number;
    componentTask: ComponentTask;
}


export type MainSection = {
    id: number;
    title: string;
}
