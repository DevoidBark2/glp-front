import { action, makeAutoObservable, runInAction } from "mobx";
import { Course } from "@/shared/api/course/model";
import { CourseComponentTypeI } from "@/stores/CourseComponent";
import { GET, POST } from "@/lib/fetcher";
import { StatusSectionEnum } from "@/shared/api/section/model";
import {
    createMainSection,
    createSection,
    deleteSectionCourse,
    getMainCourseSection,
    getSectionCourseById
} from "@/shared/api/section";

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


export type MainSection = {
    id: number;
    title: string;
}

class SectionCourse {
    constructor() {
        makeAutoObservable(this)
    }

    loadingSectionsCourse: boolean = false;
    sectionCourse: SectionCourseItem[] = []
    createSectionLoading: boolean = false;

    mainSections: MainSection[] = [];

    setCreateSectionLoading = action((value: boolean) => {
        this.createSectionLoading = value
    })

    setLoadingSectionsCourse = action((value: boolean) => {
        this.loadingSectionsCourse = value;
    })

    getAllSectionCourse = async () => {
        this.setLoadingSectionsCourse(true)
        await GET(`/api/sections`).then(response => {
            runInAction(() => {
                this.sectionCourse = response.data.map(sectionMapper);
            })
        }).finally(() => {
            this.setLoadingSectionsCourse(false)
        })
    }

    addSection = action(async (values: SectionCourseItem) => {
        this.setCreateSectionLoading(true);
        debugger
        return await createSection(values).finally(() => {
            this.setLoadingSectionsCourse(false)
        });
    })

    deleteSection = action(async (id: number) => {
        this.sectionCourse = this.sectionCourse.filter(section => section.id !== id);
        return await deleteSectionCourse(id);
    })

    getMenuSections = action (async (id: number) => {
        return await getSectionCourseById(id);
    })

    getMainSections = action(async () => {
        const data = await getMainCourseSection();
        this.mainSections = data;
    })

    addMainSection = action(async (values: MainSection) => {
        const data = await createMainSection(values)
        this.mainSections = [...this.mainSections, data];
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