import {axiosInstance} from "@/shared/api/http-client";

export const getSectionComments = async (sectionId: number) => {
    const data = (await axiosInstance.get(`api/comments/${sectionId}`)).data

    return data.data;
}

export const sendSectionComment = async (sectionId: number, comment: string) => {
    return (await axiosInstance.post(`api/comments`, {
        sectionId: sectionId,
        comment: comment,
    })).data
}

export const deleteSectionComment = async (commentId: string) => {
    return (await axiosInstance.delete(`api/comments/${commentId}`)).data
}
