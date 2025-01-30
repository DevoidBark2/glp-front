
import { Course, StatusCourseEnum } from "@/shared/api/course/model";
import { ReadonlyURLSearchParams } from "next/navigation";

export const isNewCourse = (course: Course) => course.status === StatusCourseEnum.NEW
export const isEditedCourse = (course: Course) => course.status === StatusCourseEnum.IN_PROCESSING
export const isRejectedCourse = (course: Course) => course.status === StatusCourseEnum.REJECTED
export const isExamCoursePage = (searchParams: ReadonlyURLSearchParams) => Number(searchParams.get("step")) === -1