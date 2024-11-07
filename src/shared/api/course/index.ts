import { axiosInstance, withAuth } from "../http-client";
import { Course } from "./model";

export const getAllCourses = withAuth(async (arg: any, config = {}): Promise<Course[]> => {
    debugger
    const data = (await axiosInstance.get('api/courses', config)).data;
    return data.data;
});

export const createCourse = async (): Promise<Course> => {
    const data = (await axiosInstance.post('/api/courses')).data;
    return data.data;
}


// export const 