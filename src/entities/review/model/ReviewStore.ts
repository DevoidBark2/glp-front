import { deleteCourseReview, getCourseReviews } from "@/shared/api/reviews";
import { Review } from "@/shared/api/reviews/model";
import { action, makeAutoObservable } from "mobx";
import { reviewsMapper } from "../mapper";

class ReviewStore {
    constructor() {
        makeAutoObservable(this)
    }

    courseReviews: Review[] = []

    getCourseReviews = action(async (courseId: number) => {
        const data = await getCourseReviews(courseId)

        this.courseReviews = data.map(reviewsMapper)
    })

    deleteReview = action(async (id: number) => {
        const data = await deleteCourseReview(id)
        this.courseReviews = this.courseReviews.filter(it => it.id !== id)

        return data;
    })
}

export default ReviewStore