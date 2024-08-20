import {action, makeAutoObservable} from "mobx";
import {Course} from "@/stores/CourseStore";
import {CourseComponentTypeI} from "@/stores/CourseComponent";
import {getUserToken} from "@/lib/users";
import {GET} from "@/lib/fetcher";
import {Dayjs} from "dayjs";

export type SectionCourseItem = {
    id: number;
    name: string;
    description: string;
    externalLinks: string[];
    course: Course;
    uploadFile: File[];
    components: CourseComponentTypeI[];
    created_at: Dayjs
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
        const token = getUserToken();
        await GET(`/api/sections?token=${token}`).then(response => {
            this.sectionCourse = response.response.data.map(sectionMapper);
        }).finally(() => {
            this.setLoadingSectionsCourse(false)
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
    }

    return sectionItem;
}
export default SectionCourse;