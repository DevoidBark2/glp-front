import {Course} from "@/stores/CourseStore";
import {StatusCourseEnum} from "@/enums/StatusCourseEnum";

export const isNewCourse = (course: Course) => course.status === StatusCourseEnum.NEW
export const isEditedCourse = (course: Course) => course.status === StatusCourseEnum.IN_PROCESSING
export const isRejectedCourse = (course: Course) => course.status === StatusCourseEnum.REJECTED