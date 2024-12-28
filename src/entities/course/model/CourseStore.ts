import { confirmLeaveCourse, getAllCourses } from "@/shared/api/course";
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
}


export default CourseStore;