import { action, makeAutoObservable } from "mobx";
import { DELETE, GET, POST, PUT } from "@/lib/fetcher";
import { notification } from "antd";
import { getUserToken } from "@/lib/users";
import dayjs from "dayjs";
import { StatusCourseEnum } from "@/enums/StatusCourseEnum";
import { FORMAT_VIEW_DATE } from "@/constants";
import { SectionCourseItem } from "@/stores/SectionCourse";
import { User } from "./UserStore";

export type Teacher = {
    id: number;
    name: string;
    email: string;
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
    user: User
    status: StatusCourseEnum
    sections: SectionCourseItem[]
}

export type TeacherCourse = {
    key: number;
    name: string;
    image: string;
    publish_date: Date
}
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
    courseDetailsSections: SectionCourseItem[] = [];

    setFullDetailCourse = action((value: Course) => {
        this.fullDetailCourse = value;
    })

    setSuccessCreateCourseModal = action((value: boolean) => {
        this.successCreateCourseModal = value
    })

    setLoadingCourseDetails = action((value: boolean) => {
        this.loadingCourseDetails = value
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
            notification.error({ message: e.response.data.message })
        }).finally(() => {
            this.setLoadingCourses(false);
        })
    })

    createCourse = action(async (values: any) => {
        this.setLoadingCreateCourse(true)
        const form = new FormData();
        form.append('name', values.name_course)
        form.append('small_description', values.description)
        // form.append('image',values.image.originFileObj)
        if (values.category) {
            form.append('category', values.category.toString());
        }
        form.append('access_right', values.access_right)
        form.append('duration', values.duration)
        form.append('level', values.level)
        form.append('publish_date', dayjs().format(FORMAT_VIEW_DATE))
        form.append("content_description", values.content_description)

        return await POST(`/api/courses`, form).catch(e => {
            notification.error({ message: e.response.data.message })
        }).finally(() => this.setLoadingCreateCourse(false))
    })

    getCoursesForCreator = action(async () => {
        this.setLoadingCourses(true)
        await GET(`/api/get-user-courses`).then((response) => {
            this.userCourses = response.data.courses.map(courseMapper)
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        }).finally(() => {
            this.setLoadingCourses(false)
        })
    })

    publishCourse = action(async (courseId: number) => {
        await POST(`/api/courses-publish`, { courseId: courseId }).then(response => {
            notification.success({ message: response.message })
            this.userCourses = this.userCourses.map(course => course.id === courseId ? { ...course, status: StatusCourseEnum.IN_PROCESSING } : course)
        }).catch(e => {
            notification.warning({ message: e.response.data.message })
        })
    })

    getCourseDetails = action(async (courseId: number) => {
        this.setLoadingCourseDetails(true);
        const response = await GET(`/api/course-details?courseId=${courseId}`)
        this.courseDetailsSections = response.data.sections;
        return response;
    })

    changeCourse = action(async (values: Course) => {
        const token = getUserToken();
        await PUT(`/api/courses?token=${token}`, values).then(response => {
            notification.success({ message: response.response.message })
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        })
    })

    deleteCourse = action(async (courseId: number) => {
        await DELETE(`/api/courses?courseId=${courseId}`).then(response => {
            notification.success({ message: response.message })
            this.userCourses = this.userCourses.filter(course => courseId !== course.id)

        }).catch(e => {
            notification.warning({ message: e.response.data.message })
        })
    })

    getFullCourseById = action(async (id: number) => {
        return await GET(`/api/full-course?courseId=${id}`).then(response => {
            this.setFullDetailCourse(response.data);
            return response.data;
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
        level: course.level,
        small_description: course.small_description,
        content_description: course.content_description,
        duration: course.duration,
        status: course.status,
        publish_date: dayjs(course.publish_date, FORMAT_VIEW_DATE).toDate(),
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