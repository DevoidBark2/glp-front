import {CourseComponent} from "@/shared/api/component/model";
import {ParentSection} from "@/shared/api/section/model";

import { axiosInstance } from "../http-client"

export const getAllComponents = async (): Promise<CourseComponent[]> => {
    const data  = (await axiosInstance.get('/api/components')).data

    return data.data
}

export const getComponentById = async (id: string): Promise<CourseComponent> => {
    const data = (await axiosInstance.get(`api/component-task/${id}`)).data;
    return data.data;
}

export const searchComponentsByTitle = async (query: string): Promise<CourseComponent[]> => {
    const data = (await axiosInstance.get(`api/search-components?query=${query}`)).data

    return data.data
}

export const createComponent = async (body: CourseComponent): Promise<{component: CourseComponent, message: string}> => {
    const data = (await axiosInstance.post('api/components', body)).data

    return data.data;
}

export const deleteComponentById = async (id: string): Promise<{message: string}> => (await axiosInstance.delete(`api/component-task/${id}`)).data

export const changeComponent = async (body: CourseComponent): Promise<{message: string}> => (await axiosInstance.put('api/component-task', body)).data

export const updateComponentOrder = async (sectionId: number, components: { id: string; sort: number }[]) => {
    const data = (await axiosInstance.post(`api/change-order-component`,  {
        sectionId: sectionId,
        components: components
    })).data

    return data.data
}

export const updateOrderParentSection = async (courseId: number, section: { id: number, sort: number }[]) => {
    const data = (await axiosInstance.post(`api/update-order-parent-section`, {
        courseId: courseId,
        sections: section
    })).data

    return data.data
}

export const updateOrderSection = async (courseId: number, parentId: number, sections: { id: number, sort: number }[]) => {
    const data = (await axiosInstance.post('api/update-order-section', {
        courseId: courseId,
        parentId: parentId,
        sections: sections
    })).data

    return data.data
}

export const deleteParentSection = async (courseId: number, parentId: number) => (await axiosInstance.delete(`api/delete-parent-section/${parentId}?courseId=${courseId}`)).data

export const deleteSection = async (courseId: number, sectionId: number) => (await axiosInstance.delete(`api/delete-section/${sectionId}?courseId=${courseId}`)).data

export const deleteSectionComponent = async (componentId: string, courseId: number) => (await axiosInstance.delete(`api/delete-component-section/${componentId}?courseId=${courseId}`)).data

export const handleDownloadCertificate = async (courseId: number) => {
    const response= (await axiosInstance.get(`api/get-certificate?courseId=${courseId}`, {
        responseType: "blob"
    }))

    const blob = new Blob([response.data], { type: "application/pdf" });
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", "certificate.pdf");
    document.body.appendChild(link);
    link.click();

    URL.revokeObjectURL(downloadUrl)
}