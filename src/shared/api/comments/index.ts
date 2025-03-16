import {axiosInstance} from "@/shared/api/http-client";

export const getSectionComments = async (sectionId: number) => {
    const data = (await axiosInstance.get(`api/comments/${sectionId}`)).data

    return data.data;
}

export const sendSectionComment = async (sectionId: number, comment: string) => (await axiosInstance.post(`api/comments`, {
        sectionId: sectionId,
        comment: comment,
    })).data

export const deleteSectionComment = async (commentId: string) => (await axiosInstance.delete(`api/comments/${commentId}`)).data
