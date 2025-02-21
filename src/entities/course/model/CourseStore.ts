import { action, makeAutoObservable, runInAction } from "mobx";
import { notification } from "antd";
import {
    changeCourse,
    createCourse,
    deleteCourseById, deleteCourseMember,
    getAllCourses, getAllMembersCourse,
    getCourseById,
    getCourseDetailsSections,
    getCourseTitleAndMenuById,
    getAllCoursesByUser,
    getPopularCourses,
    handleFilterByCategory,
    handleFilterBySearch,
    searchCourseByFilter,
    sendToReviewCourse,
    submitReviewCourse,
    handleCheckCourseSecretKey
} from "@/shared/api/course";
import { Course, CourseMember, CourseMenu, CourseReview, StatusCourseEnum } from "@/shared/api/course/model";
import { courseMapper, courseMemberMapper } from "@/entities/course/mappers/courseMapper";
import { axiosInstance } from "@/shared/api/http-client";
import { TaskAnswerUserDto } from "@/shared/api/task/model";
import { getCurrentSection, handleCheckUserTask, handleUpdateSectionConfirmed } from "@/shared/api/task";
import {ParentSection, SectionCourse, SectionCourseItem} from "@/shared/api/section/model";
import { Exam } from "@/shared/api/exams/model";
import { FilterValues } from "@/shared/api/filter/model";
import {updateComponentOrder, updateOrderParentSection} from "@/shared/api/component";

class CourseStore {
    constructor() {
        makeAutoObservable(this)
    }

    loadingCourses: boolean = false;

    sectionCourse: SectionCourse | null = null
    courseMenuItems: CourseMenu | null = null
    loadingCreateCourse: boolean = false;
    loadingCourseDetails: boolean = true;
    successCreateCourseModal: boolean = false;
    courseDetailsSections: SectionCourseItem[] = [];
    courses: Course[] = []
    popularCourses: Course[] = []
    userCourses: Course[] = []
    selectedIdCourse: number | null = null;
    loadingSection: boolean = true;
    courseMenuLoading: boolean = false;
    subscribeCourseLoading: boolean = false;
    loadingSubscribeCourse: boolean = false
    messageWarning: string | null = ""
    courseMembers: CourseMember[] = []
    examCourse: Exam | null = null
    resultSearchCourses: Course[] = []
    coursePageTitle: string = ""
    secret_key: string = ""
    accessRight: number = 0

    setAccessRight = action((value: number) => {
        this.accessRight = value
    })

    setSecretKey = action((value: string) => {
        this.secret_key = value
    })

    setCoursePageTitle = action((value: string) => {
        this.coursePageTitle = value
    })

    setMessageWarning = action((value: string | null) => {
        this.messageWarning = value
    })

    setSubscribeCourseLoading = action((value: boolean) => {
        this.subscribeCourseLoading = value;
    })

    setSelectedCourse = action((value: number | null) => {
        this.selectedIdCourse = value;
    })
    setLoadingSubscribeCourse = action((value: boolean) => {
        this.loadingSubscribeCourse = value;
    })

    setSectionCourse = action((value: SectionCourse | null) => {
        this.sectionCourse = value;
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

    setLoadingCreateCourse = action((value: boolean) => {
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

    setAllCourses = action((courses: Course[]) => {
        this.courses = courses
    })

    setPopularCourses = action((courses: Course[]) => {
        this.courses = courses
    })

    getAllCourses = action(async () => {
        try {
            this.setLoadingCourses(true)
            const data = await getAllCourses();
            this.setAllCourses(data.map(courseMapper));
        } catch (e) {

        } finally {
            this.setLoadingCourses(false)
        }
    })

    getAllPopularCourses = action(async () => {
        const data = await getPopularCourses()

        this.setPopularCourses(data.map(courseMapper));
    })

    deleteMember = action(async (id: number) => {
        const data = await deleteCourseMember(id)
        this.courseMembers = this.courseMembers.filter(it => id !== it.id)
        notification.success({ message: data.message })
    })

    createCourse = action(async (values: any) => {
        this.setLoadingCreateCourse(true)
        return await createCourse(values).catch(e => {
            notification.error({ message: e.response.data.message })
        }).finally(() => this.setLoadingCreateCourse(false))
    })

    getCoursesByUser = action(async () => {
        this.setLoadingCourses(true)
        await getAllCoursesByUser().then((response) => {
            this.userCourses = response.map(courseMapper)
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
        const data = await getAllMembersCourse(courseId);
        runInAction(() => {
            this.courseMembers = data.map(courseMemberMapper)
        })
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

    getCourseTitleAndMenuById = action(async (id: number): Promise<CourseMenu> => {
        this.setCourseMenuLoading(true);
        return await getCourseTitleAndMenuById(id).then(response => {
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

        runInAction(() => {
            if (this.sectionCourse) {
                this.sectionCourse.components.forEach(component => {
                    if (component.componentTask) {
                        component.componentTask.userAnswer = data.userAnswer;
                    }
                });
            }

            if (this.courseMenuItems?.sections) {
                this.courseMenuItems.sections.forEach(section => {
                    section.children = section.children.map(child =>
                        child.id === task.currentSection ? { ...child, userAnswer: data.userAnswer } : child
                    );
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


    getCourseSectionByStepId = action(async (courseId: number, currentSection: number) => {
        this.setLoadingSection(true)
        this.setSectionCourse(null);
        const data = await getCurrentSection({ courseId: courseId, currentSection: currentSection })
        if (currentSection === - 1) {
            runInAction(() => {
                this.examCourse = data.data
            })
            this.setLoadingSection(false)
            return;
        }
        if (!data.data.message) {
            runInAction(() => {
                this.setSectionCourse(data.data);
            })
        }
        else {
            this.setMessageWarning(data.data.message)
        }

        this.setLoadingSection(false)
    })

    searchCourseByFilter = action(async (values: FilterValues) => {
        const data = await searchCourseByFilter(values)
        this.resultSearchCourses = data.data.map(courseMapper)
    })

    handleFilterCoursesByCategory = action(async (id: number) => {
        this.setLoadingCourses(true)
        // this.courses = []
        const data = await handleFilterByCategory(id)
        this.courses = data.map(courseMapper)
        this.setLoadingCourses(false)
    })

    handleFilterCoursesBySearch = action(async (value: string) => {
        const data = await handleFilterBySearch(value)
        this.resultSearchCourses = data.map(courseMapper)
    })


    handleReviewSubmitCourse = action(async (values: CourseReview) => {
        const data = await submitReviewCourse(values);
    })


    handleCheckSecretKey = action(async (value: string, courseId: number) => {
        return await handleCheckCourseSecretKey(value, courseId)
    })

    updateSectionComponentsOrder = action((sectionId: number, updatedComponents: any[]) => {
        const sectionIndex = this.courseDetailsSections.findIndex(section => section.id === sectionId);

        if (sectionIndex === -1) return;

        // Обновляем порядок компонентов в указанном разделе
        this.courseDetailsSections[sectionIndex].sectionComponents = updatedComponents;

        // Принудительно обновляем состояние MobX (если используешь makeAutoObservable, это нужно)
        this.courseDetailsSections = [...this.courseDetailsSections];
    })

    updateComponentOrder = action(async (sectionId: number, components: { id: string; sort: number }[]) => {
        return await updateComponentOrder(sectionId, components)
    });

    updateParentSectionsOrder = action(async (courseId: number, sections: { id: number, sort: number }[]) => {
       await updateOrderParentSection(courseId, sections);
    })

}

export default CourseStore