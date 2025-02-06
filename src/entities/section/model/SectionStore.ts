import {action, makeAutoObservable, runInAction} from "mobx";
import {Course, CourseComponentTypeI} from "@/shared/api/course/model";
import {StatusSectionEnum} from "@/shared/api/section/model";
import {
    changeSection,
    createMainSection,
    createSection,
    deleteSectionCourse,
    getCPAllSection,
    getMainCourseSection,
    getSectionCourseById
} from "@/shared/api/section";
import {User} from "@/shared/api/user/model";
import dayjs from "dayjs";

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

class SectionStore {
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
        await getCPAllSection().then(response => {
            runInAction(() => {
                this.sectionCourse = response.map(sectionMapper);
            })
        }).finally(() => {
            this.setLoadingSectionsCourse(false)
        })
    }

    addSection = action(async (values: SectionCourseItem) => {
        this.setCreateSectionLoading(true);
        return await createSection(values).finally(() => {
            this.setLoadingSectionsCourse(false)
        });
    })

    updateSection = action(async (values: SectionCourseItem) => {
        this.setCreateSectionLoading(true);
        return await changeSection(values)
    })

    deleteSection = action(async (id: number) => {
        this.sectionCourse = this.sectionCourse.filter(section => section.id !== id);
        return await deleteSectionCourse(id);
    })

    getCourseSectionById = action (async (id: number) => {
        return await getSectionCourseById(id);
    })

    getMainSections = action(async () => {
        this.mainSections = await getMainCourseSection();
    })

    addMainSection = action(async (values: MainSection) => {
        const data = await createMainSection(values)
        this.mainSections = [...this.mainSections, data.data];
        return data
    })

}

const sectionMapper = (section: SectionCourseItem) => {
    const sectionItem: any = {
        id: section.id,
        name: section.name,
        description: section.description,
        externalLinks: section.externalLinks,
        course: section.course,
        uploadFile: section.uploadFile,
        components: section.components,
        created_at: dayjs(section.created_at).toDate(),
        status: section.status,
        user: section.user,
    }

    return sectionItem;
}
export default SectionStore;