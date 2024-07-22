import {action, makeAutoObservable} from "mobx";
import {GET, POST} from "@/lib/fetcher";
import {notification} from "antd";
import {getUserToken} from "@/lib/users";
import dayjs from "dayjs";

type Teacher = {
    id: number;
    name: string;
    email:string;
}

type Course = {
    id: number;
    name: string;
    image: string;
    teacher: Teacher
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

    setLoadingCreateCourse = ((value: boolean) => {
        this.loadingCreateCourse = value;
    })

    courses: Course[] = []

    teacherCourses: TeacherCourse[] = []
    setLoadingCourses = action((value: boolean) => {
        this.loadingCourses = value;
    })
    getAllCourses = action(async () => {
        this.setLoadingCourses(true)
        await GET('/api/courses').then(response => {
            this.courses = response.response.courses.map(courseMapper)
        }).catch(e => {
            notification.error({message: e.response.data.message})
        })
    })

    createCourse = action(async (values:any) => {
        this.setLoadingCreateCourse(true)
        const token = getUserToken();

        const form = new FormData();
        form.append('name',values.name_course)
        form.append('description',values.description)
        form.append('image',values.image.originFileObj)
        form.append('category',values.category)
        form.append('access_right',Number(values.access_right))
        form.append('duration',values.duration)
        form.append('level',Number(values.level))
        form.append('publish_date',dayjs().format('YYYY-MM-DD HH:mm'))

        await POST(`/api/courses?token=${token}`,form).catch(e => {
            notification.error({message: e.response.data.message})
        }).finally(() => this.setLoadingCreateCourse(false))
    })

    getUserCourse = action(async () => {
        this.setLoadingCourses(true)
        const token = getUserToken();

        await GET(`/api/get-user-courses?token=${token}`).then((response) => {
            this.teacherCourses = response.response.courses.map(teachCourseMapper)
        }).catch(e => {
            notification.error({message: e.response.data.message})
        })
    })
}

const courseMapper = (course: Course) => {
    return {
        id: course.id,
        name: course.name,
        image: course.image,
        teacher: course.teacher
    };
}

const teachCourseMapper = (course: TeacherCourse) => {
    return {
        id: course.id,
        name: course.name,
        image: course.image,
        publish_date: dayjs(course.publish_date).format("YYYY-MM-DD HH:mm")
    }
}
export default CourseStore