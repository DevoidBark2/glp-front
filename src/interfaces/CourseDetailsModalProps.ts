import {Course} from "@/stores/CourseStore";

export interface CourseDetailsModalProps {
    course: Course
    openModal: boolean,
    setOpenModal: (value: boolean) => void
}