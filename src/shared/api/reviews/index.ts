import { axiosInstance } from "../http-client"

export const getCourseReviews = async (courseId: number) => {
    const data = (await axiosInstance.get(`api/course-reviews?courseId=${courseId}`)).data

    return data.data
}