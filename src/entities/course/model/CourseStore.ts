import {action, makeAutoObservable, observable, runInAction} from "mobx";
import {notification} from "antd";
import {DragEndEvent} from "@dnd-kit/core";
import {arrayMove} from "@dnd-kit/sortable";

import {
    changeCourse,
    createCourse,
    deleteCourseById,
    deleteCourseMember,
    getAllCourses,
    getAllCoursesByUser,
    getAllMembersCourse,
    getCourseById,
    getCourseDetailsSections,
    getCourseTitleAndMenuById,
    getPlatformCourseById,
    handleCheckCourseSecretKey,
    submitReviewCourse
} from "@/shared/api/course";
import {Course, CourseMember, CourseMenu, CourseReview} from "@/shared/api/course/model";
import {courseMapper, courseMemberMapper} from "@/entities/course/mappers/courseMapper";
import {axiosInstance} from "@/shared/api/http-client";
import {TaskAnswerUserDto} from "@/shared/api/task/model";
import {
    getCurrentSection,
    handleCheckUserTask,
    handleUpdateSectionConfirmed,
    startExam,
    submitExamUserAnswer
} from "@/shared/api/task";
import {SectionCourse, SectionCourseItem} from "@/shared/api/section/model";
import {Exam} from "@/shared/api/exams/model";
import {
    deleteParentSection,
    deleteSection, deleteSectionComponent,
    handleDownloadCertificate,
    updateComponentOrder,
    updateOrderParentSection,
    updateOrderSection
} from "@/shared/api/component";
import {ParentColumn} from "@/entities/course/ui";

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
    messageWarning: { message: string, success: boolean } | null = null
    courseMembers: CourseMember[] = []
    examCourse: Exam | null = null
    resultSearchCourses: Course[] = []
    coursePageTitle: string = ""
    secret_key: string = ""
    accessRight: number = 0
    groupedSections: Record<string, ParentColumn> = {};
    courseDetails: Course | null = null;

    setGroupedSections = action((sections: SectionCourseItem[]) => {
        this.groupedSections = sections.reduce((acc: Record<string, ParentColumn>, section) => {
            const parentId = section.parentSection?.id;
            const parentTitle = section.parentSection?.title;
            const parentSort = section.parentSection?.sort;
            const sectionId = section.id;

            if (!parentId) {return acc;}

            if (!acc[parentId]) {
                acc[parentId] = {
                    id: parentId,
                    title: parentTitle ?? '',
                    sections: [],
                    sort: parentSort ?? 0,
                    sectionId: sectionId,
                };
            }

            acc[parentId].sections.push({
                ...section,
                sectionComponents: section.sectionComponents,
            });

            return acc;
        }, {});
    });

    onDragEndParentSection = action(async ({ active, over }: DragEndEvent,courseId: number) => {
        if (!over || active.id === over.id) {return;}

        const sectionsArray = Object.values(this.groupedSections).sort((a, b) => a.sort - b.sort);
        const activeIndex = sectionsArray.findIndex((record) => record.id === active.id);
        const overIndex = sectionsArray.findIndex((record) => record.id === over.id);

        const updatedSections = arrayMove(sectionsArray, activeIndex, overIndex);
        updatedSections.forEach((section, index) => section.sort = index);

        this.groupedSections = Object.fromEntries(updatedSections.map(section => [section.id, section]));

        const updatedOrder = updatedSections.map((section) => ({
            id: section.id,
            sectionId: section.sectionId,
            sort: section.sort
        }));

        await this.updateParentSectionsOrder(courseId, updatedOrder);
    });

    onDragEndSection = action(async ({ active, over }: DragEndEvent, parentId: number,courseId: number) => {
        if (!over || active.id === over.id) {return;}

        const parentSection = this.groupedSections[parentId];
        if (!parentSection) {return;}

        const activeIndex = parentSection.sections.findIndex((record) => record.id === active?.id);
        const overIndex = parentSection.sections.findIndex((record) => record.id === over?.id);

        parentSection.sections = arrayMove(parentSection.sections, activeIndex, overIndex);
        parentSection.sections.forEach((section, index) => section.sort = index);

        const updatedSectionOrder = parentSection.sections.map((section) => ({
            id: section.id,
            sort: section.sort,
        }));

        await this.updateSectionOrder(courseId, parentId, updatedSectionOrder);
    });

    setAccessRight = action((value: number) => {
        this.accessRight = value
    })

    setSecretKey = action((value: string) => {
        this.secret_key = value
    })

    setCoursePageTitle = action((value: string) => {
        this.coursePageTitle = value
    })

    setCourseDetails = action((value: Course) => {
        this.courseDetails = value;
    })

    setMessageWarning = action((value: { message: string, success: boolean } | null) => {
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
        this.popularCourses = courses
    })

    setResultSearchCourses = action((courses: Course[]) => {
        this.resultSearchCourses = courses.map(courseMapper);
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

    deleteMember = action(async (id: number) => {
        const data = await deleteCourseMember(id)
        this.courseMembers = this.courseMembers.filter(it => id !== it.id)
        notification.success({ message: data.message })
    })

    createCourse = action(async (values: Course) => {
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

    getCourseDetailsById = action(async (courseId: number) => await getCourseById(courseId))

    getPlatformCourseById = action(async (courseId: number) => await getPlatformCourseById(courseId))

    getCourseDetailsSections = action(async (courseId: number) => {
        await getCourseDetailsSections(courseId).then(response => {
            this.setCourseDetailsSections(response);
            this.setGroupedSections(response)
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

    submitExamAnswerUser = action(async (courseId: number, examId: number) => {
        const data = await submitExamUserAnswer(courseId, examId);

        this.setEndExamUser({
            success: data.success,
            message: data.message,
        })

        this.examCourse = {
            title: data.title,
            exam: data.exam,
            components: this.examCourse?.components.map(component => {
                const matchingComponent = data.components.find(
                    newComponent => newComponent.componentTask.id === component.componentTask.id
                );

                if (matchingComponent) {
                    return {
                        ...component,
                        componentTask: {
                            ...component.componentTask,
                            userAnswer: matchingComponent.componentTask.userAnswer
                        }
                    };
                }

                return component;
            })
        };
    });


    handleCheckTask = action(async (task: TaskAnswerUserDto, courseId: number) => {
        const data = await handleCheckUserTask(task, courseId);

        if (this.examCourse) {
            const targetComponent = this.examCourse.components.find(
                it => it.componentTask.id === task.task.id
            );

            if (targetComponent) {
                targetComponent.componentTask.userAnswer = data.userAnswer;
            }

            return data;
        }



        if (this.sectionCourse) {
            this.sectionCourse.components.forEach(component => {
                if (component.componentTask)
                    {component.componentTask.userAnswer = data.userAnswer;}
            });
        }

        if (this.courseMenuItems?.sections) {
            this.courseMenuItems.sections.forEach(section => {
                {
                    progress: data.userAnswer.progress,
                        section.children = section.children.map(child =>
                            child.id === task.currentSection ? {
                                ...child, userAnswer: {
                                    totalAnswers: data.userAnswer.totalAnswers,
                                    correctAnswers: data.userAnswer.correctAnswers,
                                }
                            } : child
                        );
                }
            });

            this.courseMenuItems.progress = data.userAnswer.progress;
        }

        return data;
    });

    updateSectionStep = action(async (prevSection: number, courseId: number) => {
        const data = await handleUpdateSectionConfirmed(prevSection, courseId);
        if (data) {
            runInAction(() => {
                // Создаём новый массив с изменёнными значениями
                const updatedSections = this.courseMenuItems?.sections.map(section => ({
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
                    }));

                // Заменяем sections новым массивом
                // @ts-ignore
                this.courseMenuItems = {
                    ...this.courseMenuItems,
                    sections: updatedSections as any,
                };
            });
        }
    });

    endExamUser: {success: boolean, message: string} | null = null;

    setEndExamUser = action((data: {success: boolean, message: string} | null) => {
        this.endExamUser = data
    })

    getCourseSectionByStepId = action(async (courseId: number, currentSection: number) => {
        this.setLoadingSection(true)
        this.setSectionCourse(null);
        this.examCourse = null;
        const data = await getCurrentSection({ courseId: courseId, currentSection: currentSection })
        if (currentSection === - 1) {
            if(data.data.exam?.isEndExam) {
                this.setEndExamUser({
                    success: data.data.success,
                    message: data.data.message,
                })

                this.examCourse = data.data
                this.setLoadingSection(false)
                return;
            }
            if (data.data.message) {
                this.setLoadingSection(false)
                this.setMessageWarning({
                    message: data.data.message,
                    success: data.data.success,
                })
                return;
            }
            if(data.data.success){
                this.setEndExamUser({
                    success: data.data.success,
                    message: data.data.message,
                })
            }

            this.examCourse = data.data
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

    startExam = action(async (courseId: number) => {
        const data = await startExam(courseId);
        this.setMessageWarning(null)

        this.examCourse = data;
    })

    handleReviewSubmitCourse = action(async (values: CourseReview) => await submitReviewCourse(values))


    handleCheckSecretKey = action(async (value: string, courseId: number) => await handleCheckCourseSecretKey(value, courseId))

    updateSectionComponentsOrder = action((sectionId: number, updatedComponents: any[]) => {
        const sectionIndex = this.courseDetailsSections.findIndex(section => section.id === sectionId);

        if (sectionIndex === -1) {return;}
        this.courseDetailsSections[sectionIndex].sectionComponents = observable([...updatedComponents]);
        this.courseDetailsSections = [...this.courseDetailsSections];
    })

    handleDragDropComponent = action((result: any, record: SectionCourseItem) => {
        if (!result.destination) {return;}

        const sectionId = record.id;
        const updatedComponents = [...record.sectionComponents];
        const [movedComponent] = updatedComponents.splice(result.source.index, 1);
        updatedComponents.splice(result.destination.index, 0, movedComponent);

        updatedComponents.forEach((component, index) => {
            component.sort = index;
        });

        this.updateSectionComponentsOrder(sectionId, updatedComponents);

        this.updateComponentOrder(sectionId, updatedComponents.map((comp, index) => ({
            id: comp.id,
            sort: index
        }))).catch((e) => {
            notification.error({ message: e.response.data.message });
        });
    })

    updateComponentOrder = action(async (sectionId: number, components: { id: string; sort: number }[]) => await updateComponentOrder(sectionId, components));

    updateParentSectionsOrder = action(async (courseId: number, sections: { id: number, sort: number }[]) => {
        await updateOrderParentSection(courseId, sections);
    })

    updateSectionOrder = action(async (courseId: number, parentId: number, sections: {id: number; sort: number}[]) => {
        await updateOrderSection(courseId, parentId, sections);
    })

    handleDownloadCertificate = action(async (courseId: number) => {
        await handleDownloadCertificate(courseId)
    })

    deleteParentSection = action(async (courseId: number, parentId: number) => await deleteParentSection(courseId, parentId).then((response) => {
            this.setGroupedSections(this.courseDetailsSections.filter((section) => section.parentSection?.id !== parentId));

            return response;
        }))

    deleteSection = action(async (courseId: number, sectionId: number) => await deleteSection(courseId, sectionId).then(response => {
            this.setGroupedSections(this.courseDetailsSections.filter((section) => section.id !== sectionId))

           return response
        }))

    deleteComponent = action(async (componentId: string, sectionId: number) => {
        const response = await deleteSectionComponent(componentId, sectionId);

        this.setGroupedSections(this.courseDetailsSections.map((section) => {
            if (section.id === sectionId) {
                section.sectionComponents = section.sectionComponents.filter(componentTask => componentTask.componentTask.id !== componentId);
            }
            return section;
        }));

        return response;
    });

}

export default CourseStore