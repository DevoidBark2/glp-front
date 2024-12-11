import { CourseComponentTypeI } from "../course/model";

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