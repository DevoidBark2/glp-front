import { getAllCourses } from "@/shared/api/course";
import { Course, SectionCourseItem } from "@/shared/api/course/model";
import { action, makeAutoObservable } from "mobx";
import { courseMapper } from "../mappers";

class CourseStore {
    constructor() {
        makeAutoObservable(this)
    }

    loadingCourses: boolean = false;

    fullDetailCourse: Course | null = null
    loadingCreateCourse: boolean = false;
    selectedCourseForDetailModal: Course | null = null
    loadingCourseDetails: boolean = true;
    successCreateCourseModal: boolean = false;
    openCourseDetailsModal: boolean = false;
    courseDetailsSections: SectionCourseItem[] = [];
    courses: Course[] = []
    userCourses: Course[] = []

    setFullDetailCourse = action((value: Course) => {
        this.fullDetailCourse = value;
    })

    setSuccessCreateCourseModal = action((value: boolean) => {
        this.successCreateCourseModal = value
    })

    setLoadingCourseDetails = action((value: boolean) => {
        this.loadingCourseDetails = value
        this.setOpenCourseDetailsModal(true);
    })

    setSelectedCourseForDetailModal = action((course: Course) => {
        this.selectedCourseForDetailModal = course;
        this.setOpenCourseDetailsModal(true);
    })

    
    setOpenCourseDetailsModal = action((value: boolean) => {
        this.openCourseDetailsModal = value;
    })

    setLoadingCreateCourse = ((value: boolean) => {
        this.loadingCreateCourse = value;
    })

    setLoadingCourses = action((value: boolean) => {
        this.loadingCourses = value;
    })

    getAllCourses = action(async () => {
        try{
            this.setLoadingCourses(true)
            const data = await getAllCourses();
            this.courses = data.map(courseMapper);
        }catch(e) {
            //notification.error({ message: e.response.data.message })
        }finally {
            this.setLoadingCourses(false)
        }
    })

    // createCourse = action(async (values: any) => {
    //     this.setLoadingCreateCourse(true)
    //     const form = new FormData();
    //     form.append('name', values.name_course)
    //     form.append('small_description', values.description)
    //     // form.append('image',values.image.originFileObj)
    //     if (values.category) {
    //         form.append('category', values.category.toString());
    //     }
    //     form.append('access_right', values.access_right)
    //     form.append('duration', values.duration)
    //     form.append('level', values.level)
    //     form.append('publish_date', dayjs().format(FORMAT_VIEW_DATE))
    //     form.append("content_description", values.content_description)

    //     return await POST(`/api/courses`, form).catch(e => {
    //         notification.error({ message: e.response.data.message })
    //     }).finally(() => this.setLoadingCreateCourse(false))
    // })

}


export default CourseStore;