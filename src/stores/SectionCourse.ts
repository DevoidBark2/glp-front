import { action, makeAutoObservable } from "mobx";
import { Course } from "@/shared/api/course/model";
import { CourseComponentTypeI } from "@/stores/CourseComponent";
import { GET, POST } from "@/lib/fetcher";
import { StatusSectionEnum } from "@/shared/api/section";

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
}

class SectionCourse {
    constructor() {
        makeAutoObservable(this)
    }

    loadingSectionsCourse: boolean = false;
    sectionCourse: SectionCourseItem[] = []


    setLoadingSectionsCourse = action((value: boolean) => {
        this.loadingSectionsCourse = value;
    })

    getAllSectionCourse = action(async () => {
        this.setLoadingSectionsCourse(true)
        await GET(`/api/sections`).then(response => {
            this.sectionCourse = response.data.map(sectionMapper);
        }).finally(() => {
            this.setLoadingSectionsCourse(false)
        })
    })

    addSection = action(async (values: SectionCourseItem) => {
        return await POST(`/api/sections`, values).catch(e => {
        })
    })
}

const sectionMapper = (section: SectionCourseItem) => {
    const sectionItem: SectionCourseItem = {
        id: section.id,
        name: section.name,
        description: section.description,
        externalLinks: section.externalLinks,
        course: section.course,
        uploadFile: section.uploadFile,
        components: section.components,
        created_at: section.created_at,
        status: section.status
    }

    return sectionItem;
}
export default SectionCourse;