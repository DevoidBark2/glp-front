import { Course } from "../course/model"
import { User } from "../user/model"

export type Review = {
    id: number
    rating: number
    review: string
    user: User
    course: Course
    created_at: Date
}