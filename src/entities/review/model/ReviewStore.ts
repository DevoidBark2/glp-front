import { deleteCourseReview, getCourseReviews } from "@/shared/api/reviews";
import { Review } from "@/shared/api/reviews/model";
import { action, makeAutoObservable } from "mobx";
import { reviewsMapper } from "../mapper";

class ReviewStore {
    constructor() {
        makeAutoObservable(this)
    }

    courseReviews: Review[] = []

    setCourseReviews = action((reviews: Review[]) => {
        this.courseReviews = reviews.map(reviewsMapper)
    })

    getCourseReviews = action(async (courseId: number) => {
        const data = await getCourseReviews(courseId)
        this.setCourseReviews(data)
    })

    deleteReview = action(async (id: number) => {
        const data = await deleteCourseReview(id)
        this.setCourseReviews(this.courseReviews.filter(it => it.id !== id))

        return data;
    })
}

export default ReviewStore