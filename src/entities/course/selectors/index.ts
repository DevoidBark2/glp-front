
import { ReadonlyURLSearchParams } from "next/navigation";

import { Course, StatusCourseEnum } from "@/shared/api/course/model";

export const isEditedCourse = (course: Course) => course.status === StatusCourseEnum.IN_PROCESSING
export const isExamCoursePage = (searchParams: ReadonlyURLSearchParams) => Number(searchParams.get("step")) === -1