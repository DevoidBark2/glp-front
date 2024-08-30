import {action, makeAutoObservable} from "mobx";
import {GET, POST, PUT} from "@/lib/fetcher";
import {notification} from "antd";
import {getUserToken} from "@/lib/users";
import dayjs from "dayjs";
import {StatusCourseEnum} from "@/enums/StatusCourseEnum";
import {FORMAT_VIEW_DATE} from "@/constants";
import {SectionCourseItem} from "@/stores/SectionCourse";
import {CourseComponentTypeI} from "@/stores/CourseComponent";

export type Teacher = {
    id: number;
    name: string;
    email:string;
}

type Category = {
    id: number;
    name: string
}

export type Course = {
    id: number;
    name: string;
    image: string;
    category: Category;
    access_right: number;
    level: number;
    small_description: string;
    content_description: string;
    duration: number
    publish_date: Date
    user: Teacher
    status: StatusCourseEnum
}

export type TeacherCourse = {
    key: number;
    name: string;
    image: string;
    publish_date: Date
}
class CourseStore{
    constructor() {
        makeAutoObservable(this)
    }

    loadingCourses: boolean = false;

    loadingCreateCourse: boolean = false;
    selectedCourseForDetailModal: Course | null = null

    showConfirmDeleteCourseModal: boolean = false;

    loadingCourseDetails: boolean = true;

    courseDetailsSections: SectionCourseItem[] = [];
    courseDetailsComponent:CourseComponentTypeI[] = [];

    setLoadingCourseDetails = action((value: boolean) => {
        this.loadingCourseDetails = value
    })
    setShowConfirmDeleteCourseModal = action((value: boolean) => {
        this.showConfirmDeleteCourseModal = value;
    })

    setSelectedCourseForDetailModal = action((course: Course) => {
        this.selectedCourseForDetailModal = course;
    })

    openCourseDetailsModal: boolean = false;
    setOpenCourseDetailsModal = action((value: boolean) => {
        this.openCourseDetailsModal = value;
    })



    setLoadingCreateCourse = ((value: boolean) => {
        this.loadingCreateCourse = value;
    })

    courses: Course[] = []

    userCourses: Course[] = []
    setLoadingCourses = action((value: boolean) => {
        this.loadingCourses = value;
    })
    getAllCourses = action(async () => {
        this.setLoadingCourses(true)
        await GET('/api/courses').then(response => {
            this.courses = response.response.data.map(courseMapper)
        }).catch(e => {
            notification.error({message: e.response.data.message})
        }).finally(() => {
            this.setLoadingCourses(false);
        })
    })

    createCourse = action(async (values:any) => {
        this.setLoadingCreateCourse(true)
        const token = getUserToken();

        const form = new FormData();
        form.append('name',values.name_course)
        form.append('small_description',values.description)
        // form.append('image',values.image.originFileObj)
        form.append('category',values.category)
        form.append('access_right',values.access_right)
        form.append('duration',values.duration)
        form.append('level',values.level)
        form.append('publish_date',dayjs().format(FORMAT_VIEW_DATE))
        form.append("content_description",values.content_description)

        return await POST(`/api/courses?token=${token}`,form).catch(e => {
            notification.error({message: e.response.data.message})
        }).finally(() => this.setLoadingCreateCourse(false))
    })

    getCoursesForCreator = action(async () => {
        this.setLoadingCourses(true)
        const token = getUserToken();
        await GET(`/api/get-user-courses?token=${token}`).then((response) => {
            this.userCourses = response.response.data.courses.map(courseMapper)
        }).catch(e => {
            notification.error({message: e.response.data.message})
        }).finally(() => {
            this.setLoadingCourses(false)
        })
    })

    publishCourse = action(async(courseId: number) =>{
        const token = getUserToken();
        await POST(`/api/courses-publish?token=${token}`,{courseId: courseId}).then(response => {
            notification.success({message: response.response.data.message})
        }).catch(e => {
            notification.warning({message: e.response.data.message})
        })
    })

    getCourseDetails = action(async(courseId: number) => {
        this.setLoadingCourseDetails(true);
        const response = await GET(`/api/course-details?courseId=${courseId}`)
        this.courseDetailsSections =  response.response.data.sections;
        return response;
    })

    changeCourse = action(async (values: Course) => {
        const token = getUserToken();
        await PUT(`/api/courses?token=${token}`,values).then(response => {
            notification.success({message: response.response.message})
        }).catch(e => {
            notification.error({message: e.response.data.message})
        })
    })
}

export const courseMapper = (course: Course) => {
    return {
        id: course.id,
        name: course.name,
        image: course.image,
        category: course.category,
        access_right: course.access_right,
        level:course.level,
        small_description: course.small_description,
        content_description: course.content_description,
        duration: course.duration,
        status: course.status,
        publish_date: dayjs(course.publish_date,FORMAT_VIEW_DATE).toDate(),
        user: course.user
    };
}

// const teachCourseMapper = (course: TeacherCourse) => {
//     return {
//         id: course.id,
//         name: course.name,
//         image: course.image,
//         publish_date:
//     }
// }
export default CourseStore