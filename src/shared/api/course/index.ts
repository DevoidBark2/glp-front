import { axiosInstance } from "../http-client";

export const getAllCourses = async () => (await axiosInstance.get('/api/courses')).data;