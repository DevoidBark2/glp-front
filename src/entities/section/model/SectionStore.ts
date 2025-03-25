import {action, makeAutoObservable, runInAction} from "mobx";
import dayjs from "dayjs";
import {UploadFile} from "antd/es/upload/interface";

import {
    changeSection,
    createMainSection,
    createSection,
    deleteSectionCourse,
    getCPAllSection,
    getMainCourseSection,
    getSectionCourseById
} from "@/shared/api/section";
import {SectionCourseItem} from "@/shared/api/section/model";


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
    uploadedImages: UploadFile[] = [];

    setUploadedImages = action((images:any) => {
        this.uploadedImages = images;
    });

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

    getCourseSectionById = action (async (id: number) => await getSectionCourseById(id))

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