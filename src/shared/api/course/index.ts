import { axiosInstance } from "../http-client";
import { Course } from "./model";

export const getAllCourses = async (): Promise<Course[]> => {
    const data = (await axiosInstance.get('api/courses')).data;
    return data.data;
};

export const createCourse = async (): Promise<Course> => {
    const data = (await axiosInstance.post('/api/courses')).data;
    return data.data;
}


// export const 