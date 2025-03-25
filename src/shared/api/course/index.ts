import { axiosInstance } from "../http-client";

import { Course, CourseReview } from "./model";

export const getAllCourses = async (): Promise<Course[]> => {
    const data = (await axiosInstance.get('api/courses')).data;
    return data.data;
}

export const getAllCoursesByUser = async (): Promise<Course[]> => {
    const data = (await axiosInstance.get('api/get-user-courses')).data

    return data.data
}

export const createCourse = async (values: Course) => {
    const form = new FormData();
    form.append('name', values.name)
    form.append('small_description', values.small_description)
    form.append('has_certificate', `${values.has_certificate}`)
    if (values.image && typeof values.image !== "string") {
        form.append('image', values.image.originFileObj!);
    }
    form.append('access_right', `${values.access_right}`)
    form.append('duration', `${values.duration}`)
    form.append('level', `${values.level}`)
    if (values.category) {form.append('category', values.category.toString());}
    if (values.content_description) {form.append("content_description", values.content_description)}

    return (await axiosInstance.post('/api/course', form, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })).data;
}

export const confirmLeaveCourse = async (courseId: number) => (await axiosInstance.delete(`api/leave-course/${courseId}`)).data

export const getCourseById = async (courseId: number) => {
    const data = (await axiosInstance.get(`api/course/${courseId}`)).data;

    return data.data;
}

export const getPlatformCourseById = async (courseId: number) => {
    const data = (await axiosInstance.get(`api/courses/${courseId}`)).data;

    return data.data;
}

export const deleteCourseById = async (id: number) => (await axiosInstance.delete(`api/course/${id}`)).data

export const changeCourse = async (course: Course) => (await axiosInstance.put('api/course', course)).data

export const sendToReviewCourse = async (id: number) => (await axiosInstance.post('api/publish-course', { courseId: id })).data

export const getCourseDetailsSections = async (courseId: number) => {
    const data = (await axiosInstance.get(`api/course-sections/${courseId}`)).data

    return data.data
}

export const getCourseTitleAndMenuById = async (courserId: number) => (await axiosInstance.get(`api/get-course-menu?courseId=${courserId}`)).data

export const getAllMembersCourse = async (courseId: number) => {
    const data = (await axiosInstance.get(`api/get-course-members?courseId=${courseId}`)).data

    return data.data;
}

export const deleteCourseMember = async (id: number) => (await axiosInstance.delete(`api/delete-course-member?id=${id}`)).data

export const submitReviewCourse = async (values: CourseReview) => (await axiosInstance.post('/api/course-review', values)).data

export const handleCheckCourseSecretKey = async (value: string, courseId: number) => {
    const data = (await axiosInstance.post('/api/check-secret-key', { secret_key: value, courseId: courseId })).data

    return data.data
}