import { axiosInstance } from "../http-client"

import {Comments, Post, PostCreateForm, PostStatusEnum} from "./model";

export const getAllPost = async (): Promise<Post[]> => {
    const data = (await axiosInstance.get('api/posts')).data;
    return data.data;
};

export const getCPAllPost = async (): Promise<Post[]> => {
    const response = (await axiosInstance.get('api/posts-user')).data;
    return response.data;
};

export const getPostById = async (id: number) => {
    const data = (await axiosInstance.get(`api/getPostById?postId=${id}`)).data;
    return data.data;
};

export const createPost = async (values: PostCreateForm) => {
    const form = new FormData();
    form.append("name", values.name);
    form.append("content", values.content);
    if (values.description) {form.append("description", values.description);}
    // if (values.image) {
    //     form.append("image", values.image);
    // }

    return (await axiosInstance.post("/api/posts", form)).data;
};


export const publishPost = async (postId: number, checked: boolean) => (await axiosInstance.post('api/publish-post', { id: postId, checked: checked })).data;

export const changePost = async (post: Post) => {
    const form = new FormData();
    form.append("name", post.name);
    form.append("content", post.content);
    if (post.description) {form.append("description", post.description);}
    if (post.image) {form.append("image", post.image);}
    const data = (await axiosInstance.put('api/post', post)).data

    return data.data;
}

export const deletePost = async (id: number) => (await axiosInstance.delete(`/api/posts/${id}`)).data;

export const submitReviewPost = async (id: number) => (await axiosInstance.put(`/api/submit-preview?postId=${id}`, {})).data;


export const updatePostStatus = async (postId: number, status: PostStatusEnum, comment: string, comments: Comments) => {
    const data = (await axiosInstance.post('api/update-post-status', {
        postId: postId,
        status: status,
        comment: comment,
        comments: comments
    })).data

    return data.data;
}