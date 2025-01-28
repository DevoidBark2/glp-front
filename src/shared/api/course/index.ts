import { FilterValues } from "../filter/model";
import { axiosInstance, withAuth } from "../http-client";
import { Course } from "./model";

export const getAllCourses = withAuth(async (arg: any, config = {}): Promise<Course[]> => {
    const data = (await axiosInstance.get('api/courses', config)).data;
    return data.data;
});

export const getCPAllCourse = async () => {
    const data = (await axiosInstance.get('api/get-user-courses')).data

    return data.data
}

export const createCourse = async (values: any): Promise<Course> => {
    const hasCertificate = values.has_certificate !== undefined ? String(Boolean(values.has_certificate)) : 'false';
    const form = new FormData();
    form.append('name', values.name)
    form.append('small_description', values.small_description)
    form.append('has_certificate', hasCertificate)
    // form.append('image',values.image.originFileObj)
    if (values.category) {
        form.append('category', values.category.toString());
    }
    form.append('access_right', values.access_right)
    form.append('duration', values.duration)
    form.append('level', values.level)
    if (values.content_description) form.append("content_description", values.content_description)

    const data = (await axiosInstance.post('/api/course', form)).data;
    return data.data;
}

export const confirmLeaveCourse = withAuth(async (courseId: number, config = {}) => {
    const data = (await axiosInstance.delete(`api/leave-course/${courseId}`, config)).data

    return data.data;
})

export const getCourseById = withAuth(async (courseId: number, config = {}) => {
    const data = (await axiosInstance.get(`api/course/${courseId}`, config)).data;

    return data.data;
})

export const deleteCourseById = async (id: number) => {
    return (await axiosInstance.delete(`api/course/${id}`)).data
}

export const changeCourse = async (course: Course) => {
    return (await axiosInstance.put('api/course', course)).data;
}

export const sendToReviewCourse = async (id: number) => {
    return (await axiosInstance.post('api/publish-course', { courseId: id })).data;
}

export const getCourseDetailsSections = async (courseId: number) => {
    const data = (await axiosInstance.get(`api/course-sections/${courseId}`)).data

    return data.data
}


export const getFullCourse = async (courserId: number) => {
    return (await axiosInstance.get(`api/full-course?courseId=${courserId}`)).data
}

export const handleFilterByCategory = async (id: number) => {
    const data = (await axiosInstance.get(`api/get-courses?categoryId=${id}`)).data

    return data.data;
}

export const handleFilterBySearch = async (value: string) => {
    const data = (await axiosInstance.get(`api/search-courses?search=${value}`)).data

    return data.data;
}

export const getAllMembersCourse = async (courseId: number) => {
    const data = (await axiosInstance.get(`api/get-course-members?courseId=${courseId}`)).data

    return data.data;
}

export const deleteCourseMember = async (id: number) => {
    return (await axiosInstance.delete(`api/delete-course-member?id=${id}`)).data
}

export const getAllExams = async () => {
    const data = (await axiosInstance.get(`api/get-user-exams`)).data
}

export const searchCourseByFilter = async (values: FilterValues) => {
    const data = (await axiosInstance.post('/api/search-course-by-filter', values))

    return data.data
}