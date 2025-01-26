import { action, makeAutoObservable, runInAction } from "mobx";
import { GET } from "@/lib/fetcher";
import { notification } from "antd";
import { SectionCourseItem } from "@/stores/SectionCourse";
import {
    changeCourse,
    createCourse,
    deleteCourseById,
    getAllCourses,
    getAllMembersCourse,
    getCourseById,
    getCourseDetailsSections,
    getCPAllCourse, getFullCourse, handleFilterByCategory, handleFilterBySearch,
    sendToReviewCourse
} from "@/shared/api/course";
import { Course, StatusCourseEnum } from "@/shared/api/course/model";
import { courseMapper } from "@/entities/course/mappers/courseMapper";
import { axiosInstance } from "@/shared/api/http-client";
import { TaskAnswerUserDto } from "@/shared/api/task/model";
import { getCurrentSection, handleCheckUserTask, handleUpdateSectionConfirmed } from "@/shared/api/task";
import { SectionCourse } from "@/shared/api/section/model";

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
    name: string,
    courseName: string,
    progress: number,
    userAnswer: UserAnswer,
    children: CourseMenu[],
    sections: CourseMenu[]
}

class CourseStore {
    constructor() {
        makeAutoObservable(this)
    }

    loadingCourses: boolean = false;

    fullDetailCourse: SectionCourse | null = null
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
    courseMenuLoading: boolean = false;
    subscribeCourseLoading: boolean = false;
    loadingSubscribeCourse: boolean = false

    setSubscribeCourseLoading = action((value: boolean) => {
        this.subscribeCourseLoading = value;
    })

    setSelectedCourse = action((value: number | null) => {
        this.selectedIdCourse = value;
    })
    setLoadingSubscribeCourse = action((value: boolean) => {
        this.loadingSubscribeCourse = value;
    })

    setFullDetailCourse = action((value: SectionCourse | null) => {
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

    setCourseDetailsSections = action((value: SectionCourseItem[]) => {
        this.courseDetailsSections = value
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
        return await createCourse(values).catch(e => {
            notification.error({ message: e.response.data.message })
        }).finally(() => this.setLoadingCreateCourse(false))
    })

    getCoursesForCreator = action(async () => {
        this.setLoadingCourses(true)
        await getCPAllCourse().then((response) => {
            this.userCourses = response.courses.map(courseMapper)
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        }).finally(() => {
            this.setLoadingCourses(false)
        })
    })

    publishCourse = action(async (courseId: number) => {
        await sendToReviewCourse(courseId).then(response => {
            notification.success({ message: response.message })
            this.userCourses = this.userCourses.map(course => course.id === courseId ? { ...course, status: StatusCourseEnum.IN_PROCESSING } : course)
        }).catch(e => {
            notification.warning({ message: e.response.data.message })
        })
    })

    getCourseDetailsById = action(async (courseId: number) => {
        return await getCourseById(courseId);
    })

    getCourseDetailsSections = action(async (courseId: number) => {
        await getCourseDetailsSections(courseId).then(response => {
            this.setCourseDetailsSections(response);
        })

    })

    getAllMembersCourse = action(async (courseId: number) => {
        debugger
        const data = await getAllMembersCourse(courseId);
        debugger
    })

    changeCourse = action(async (values: Course) => {
        await changeCourse(values).then(response => {
            notification.success({ message: response.message })
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        })
    })

    deleteCourse = action(async (courseId: number) => {
        await deleteCourseById(courseId).then(response => {
            notification.success({ message: response.message })
            this.userCourses = this.userCourses.filter(course => courseId !== course.id)
        }).catch(e => {
            notification.warning({ message: e.response.data.message })
        })
    })

    getFullCourseById = action(async (id: number) => {
        this.setCourseMenuLoading(true);
        return await getFullCourse(id).then(response => {
            // this.setFullDetailCourse(response.data);
            this.setCourseMenuItems(response.data)
            return response.data;
        }).finally(() => {
            this.setCourseMenuLoading(false);
        })
    })

    subscribeCourse = action(async (courseId: number, userId: string) => {
        this.setLoadingSubscribeCourse(true)
        try {
            return await axiosInstance.post('api/subscribe-course', {
                courseId: courseId,
                userId: userId
            })
        } finally {
            this.setLoadingSubscribeCourse(false)
        }
    })

    handleCheckTask = action(async (task: TaskAnswerUserDto) => {
        const data = await handleCheckUserTask(task);


        // обновить копмонент + обновить меню
        runInAction(() => {
            this.fullDetailCourse!.components = this.fullDetailCourse!.components.map((section: any) => {

                // Проверяем, соответствует ли componentTask в секции текущей задаче
                if (section.componentTask.id === task.task.id) {
                    // Если componentTask совпадает с task.id, обновляем его
                    return {
                        ...section,
                        componentTask: {
                            ...section.componentTask,
                            // Обновляем ответы для componentTask
                            userAnswer: data.answers.answer,
                            sectionComponents: (section.componentTask.sectionComponents || []).map((component: any) => {
                                if (component.componentTask.id === task.task.id) {
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
                        },
                    };
                }

                // Если componentTask не совпадает, возвращаем секцию без изменений
                return section;
            });

            if (this.courseMenuItems && this.courseMenuItems.sections) {
                const updatedSections = this.courseMenuItems?.sections.map(section => ({
                    ...section,
                    children: section.children.map(child => {
                        if (child.id === data.answers.section.id) {
                            return { ...child, userAnswer: data.userAnswer };
                        }
                        return child;
                    }),
                }));

                runInAction(() => {
                    this.courseMenuItems = { ...this.courseMenuItems, sections: updatedSections };
                });
            }
        });


        return data;
    });

    updateSectionStep = action(async (prevSection: number) => {
        const data = await handleUpdateSectionConfirmed(prevSection);
        if (data) {
            runInAction(() => {
                // Создаём новый массив с изменёнными значениями
                const updatedSections = this.courseMenuItems?.sections.map(section => {
                    return {
                        ...section,
                        children: section.children.map(child => {
                            if (child.id === prevSection) {
                                return {
                                    ...child,
                                    userAnswer: data.answer, // Обновляем userAnswer
                                };
                            }
                            return child;
                        }),
                    };
                });

                // Заменяем sections новым массивом
                // @ts-ignore
                this.courseMenuItems = {
                    ...this.courseMenuItems,
                    sections: updatedSections as any,
                };
            });
        }
    });


    getMenuSections = action(async (courseId: number, currentSection: number) => {
        this.setLoadingSection(true)
        this.setFullDetailCourse(null);
        const data = await getCurrentSection({ courseId: courseId, currentSection: currentSection })
        runInAction(() => {
            this.setFullDetailCourse(data.data);
        })

        this.setLoadingSection(false)
    })

    handleFilterCoursesByCategory = action(async (id: number) => {
        // this.setLoadingCourses(true)
        // this.courses = []
        const data = await handleFilterByCategory(id)
        this.courses = data.map(courseMapper)
        // this.setLoadingCourses(false)
    })

    handleFilterCoursesBySearch = action(async (value: string) => {
        const data = await handleFilterBySearch(value)
        debugger
        this.courses = data.map(courseMapper)
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