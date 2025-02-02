import { Review } from "@/shared/api/reviews/model"

export const reviewsMapper = (review: Review): Review => {
    return {
        id: review.id,
        rating: review.rating,
        review: review.review,
        user: review.user,
        course: review.course,
        created_at: review.created_at
    }
}