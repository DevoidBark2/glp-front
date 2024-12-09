import { action, makeAutoObservable, runInAction } from "mobx";
import { DELETE, GET, POST, PUT } from "@/lib/fetcher";
import { notification } from "antd";
import { getUserToken } from "@/lib/users";
import dayjs from "dayjs";
import { FORMAT_VIEW_DATE } from "@/constants";
import { SectionCourseItem } from "@/stores/SectionCourse";
import { getAllCourses, getCourseById } from "@/shared/api/course";
import { Course, StatusCourseEnum } from "@/shared/api/course/model";
import { courseMapper } from "@/entities/course/mappers/courseMapper";
import { axiosInstance } from "@/shared/api/http-client";
import axios from "axios";
import { TaskAnswerUserDto } from "@/shared/api/task/model";
import { getCurrentSection, handleCheckUserTask, handleUpdateSectionConfirmed } from "@/shared/api/task";
import { MenuItem } from "@/utils/dashboardMenu";

enum CourseMenuStatus {
    NOT_STARTED = "not_started",
    FAILED = "failed",
    WARNING = "warning",
    SUCCESS = "success"
}

type UserAnswer = {
    confirmedStep?: number,
    totalAnswers?: number,
    correctAnswers?: number
}

export type CourseMenu = {
    id: number,
    courseName: string,
    userAnswer: UserAnswer,
    children: CourseMenu[],
    sections: CourseMenu[]
}

class CourseStore {
    constructor() {
        makeAutoObservable(this)
    }

    loadingCourses: boolean = false;

    fullDetailCourse: Course | null = null
    courseMenuItems: CourseMenu | null = null
    loadingCreateCourse: boolean = false;
    selectedCourseForDetailModal: Course | null = null
    loadingCourseDetails: boolean = true;
    successCreateCourseModal: boolean = false;
    openCourseDetailsModal: boolean = false;
    courseDetailsSections: SectionCourseItem[] = [];
    courses: Course[] = []
    userCourses: Course[] = []
    selectedIdCourse: number | null = null;
    loadingSection: boolean = false;
    courseMenuLoading: boolean = false

    loadingSubscribeCourse: boolean = false;

    setSelectedCourse = action((value: number | null) => {
        this.selectedIdCourse = value;
    })
    setLoadingSubscribeCourse = action((value: boolean) => {
        this.loadingSubscribeCourse = value;
    })

    setFullDetailCourse = action((value: Course | null) => {
        this.fullDetailCourse = value;
    })

    setCourseMenuItems = action((value: any) => {
        this.courseMenuItems = value;
    })

    setSuccessCreateCourseModal = action((value: boolean) => {
        this.successCreateCourseModal = value
    })

    setLoadingCourseDetails = action((value: boolean) => {
        this.loadingCourseDetails = value
    })

    setSelectedCourseForDetailModal = action((course: Course | null) => {
        this.selectedCourseForDetailModal = course;
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

    setLoadingSection = action((value: boolean) => {
        this.loadingSection = value
    })

    setCourseMenuLoading = action((value: boolean) => {
        this.courseMenuLoading = value;
    })

    getAllCourses = action(async () => {
        try {
            this.setLoadingCourses(true)
            const data = await getAllCourses();
            this.courses = data.map(courseMapper);
        } catch (e) {

        } finally {
            this.setLoadingCourses(false)
        }
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
        if(values.content_description) form.append("content_description", values.content_description)

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

    getCourseDetailsById = action(async(courseId: number) => {
        return await getCourseById(courseId);
    })

    changeCourse = action(async (values: Course) => {
        const token = getUserToken();
        await PUT(`/api/courses?token=${token}`, values).then(response => {
            notification.success({ message: response.message })
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
        this.setCourseMenuLoading(true);
        return await GET(`/api/full-course?courseId=${id}`).then(response => {
            // this.setFullDetailCourse(response.data);
            this.setCourseMenuItems(response.data)
            return response.data;
        }).finally(() => {
            this.setCourseMenuLoading(false);
        })
    })

    subscribeCourse = action(async (courseId: number, userId: number) => {
        this.setLoadingSubscribeCourse(true)
        try {
            const data = await axiosInstance.post('api/subscribe-course', {
                courseId: courseId,
                userId: userId
            })

            return data
        } finally {
            this.setLoadingSubscribeCourse(false)
        }
    })

    handleCheckTask = action(async (task: TaskAnswerUserDto) => {
        const data = await handleCheckUserTask(task);

        runInAction(() => {
            this.fullDetailCourse!.sections = this.fullDetailCourse!.sections.map((section) => {
                return {
                    ...section,
                    children: section.children.map((child) => {
                        if (child.id === task.currentSection) {
                            return {
                                ...child,
                                sectionComponents: (child.sectionComponents || []).map((component) => {
                                    if (component.componentTask.id === task.task.id) {
                                        // Обновляем данные для componentTask и userAnswer
                                        console.log('Обновляем userAnswer для componentTask.id:', component.componentTask.id);
                                        console.log('Ответы:', data.answers.answer);
                                        return {
                                            ...component,
                                            componentTask: {
                                                ...component.componentTask,
                                                userAnswer: data.answers.answer, // Обновляем userAnswer в componentTask
                                            },
                                        };
                                    }
                                    return component; // Оставляем компонент неизменным
                                }),
                            };
                        }
                        return child; // Оставляем child неизменным
                    }),
                };
            });
        });


        return data;
    });

    updateSectionStep = action(async (prevSection: number) => {
        const data = await handleUpdateSectionConfirmed(prevSection);
    })

    getSectionById = action(async (courseId: number, currentSection: number) => {
        this.setLoadingSection(true)
        this.setFullDetailCourse(null);
        const data = await getCurrentSection({ courseId: courseId, currentSection: currentSection })
        runInAction(() => {
            debugger
            this.setFullDetailCourse(data.data);
        })

        this.setLoadingSection(false)
    })
}

// export const courseMapper = (course: Course) => {
//     return {
//         id: course.id,
//         name: course.name,
//         image: course.image,
//         category: course.category,
//         access_right: course.access_right,
//         level: course.level,
//         small_description: course.small_description,
//         content_description: course.content_description,
//         duration: course.duration,
//         status: course.status,
//         publish_date: dayjs(course.publish_date, FORMAT_VIEW_DATE).toDate(),
//         user: course.user
//     };
// }

// const teachCourseMapper = (course: TeacherCourse) => {
//     return {
//         id: course.id,
//         name: course.name,
//         image: course.image,
//         publish_date:
//     }
// }
export default CourseStore