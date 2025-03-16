import { axiosInstance } from "../http-client"

export const getCourseReviews = async (courseId: number) => {
    const data = (await axiosInstance.get(`api/course-reviews?courseId=${courseId}`)).data

    return data.data
}

export const deleteCourseReview = async (id: number): Promise<any> => (await axiosInstance.delete(`api/course-reviews/${id}`)).data