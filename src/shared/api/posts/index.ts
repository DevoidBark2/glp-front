import { axiosInstance, withAuth } from "../http-client"
import {Post, PostCreateForm, PostStatusEnum} from "./model";
import {Comments} from "@/app/control-panel/manage-posts/page";

export const getAllPost = async (): Promise<Post[]> => {
    const data = (await axiosInstance.get('api/posts')).data;
    return data.data;
};

export const getCPAllPost = async (): Promise<Post[]> => {
    const response = (await axiosInstance.get('api/posts-user')).data;
    return response.data;
};

export const getPostById = async (id: number): Promise<Post> => {
    const data = (await axiosInstance.get(`api/getPostById?postId=${id}`)).data;
    return data.data;
};

export const createPost = async (values: PostCreateForm, config = {}) => {
    const form = new FormData();
    form.append("name", values.name);
    form.append("content", values.content);
    if(values.description) form.append("description", values.description);
    if (values.image?.originFileObj) form.append("image", values.image.originFileObj);

    return (await axiosInstance.post("/api/posts", form, config)).data;
};


export const publishPost = async (postId: number, checked: boolean) => (await axiosInstance.post('api/publish-post', { id: postId, checked: checked })).data;

export const changePost = withAuth(async (post: Post, config = {}) => (await axiosInstance.put('api/post', post, config)).data);

export const deletePost = async (id: number) => (await axiosInstance.delete(`/api/posts/${id}`)).data;

export const submitReviewPost = withAuth(async (id: number, config = {}) => (await axiosInstance.put(`/api/submit-preview?postId=${id}`, {}, config)).data);


export const updatePostStatus = async (postId: number, status: PostStatusEnum, comment: string, comments: Comments) => {
    const data = (await axiosInstance.post('api/update-post-status', {
        postId: postId,
        status: status,
        comment: comment,
        comments: comments
    })).data

    return data.data;
}