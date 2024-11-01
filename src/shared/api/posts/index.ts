import { axiosInstance, withAuth } from "../http-client"
import { Post, PostCreateForm } from "./model";

export const getAllPost = async (): Promise<Post[]> => {
    const data = (await axiosInstance.get('api/posts')).data;
    return data.data;
};

export const getCPAllPost = withAuth(async (arg: any, config = {}): Promise<Post[]> => {
    const response = (await axiosInstance.get('api/posts-user', config)).data;
    return response.data;
});

export const getPostById = async (id: number): Promise<Post> => {
    const data = (await axiosInstance.get(`api/getPostById?postId=${id}`)).data;
    return data.data;
};

export const createPost = withAuth(async (values: PostCreateForm, config = {}): Promise<Post> => {
    const form = new FormData();
    form.append("name", values.name);
    form.append("description", values.description);
    form.append("content", values.content);
    if (values.image?.originFileObj) form.append("image", values.image.originFileObj);
    if (values.status) form.append("status", values.status);
    if (typeof values.is_publish !== "undefined") form.append("is_publish", String(values.is_publish));

    return (await axiosInstance.post<Post>("/api/posts", form, config)).data;
});


export const publishPost = async (postId: number, checked: boolean) => (await axiosInstance.post('api/publish-post', {id: postId, checked: checked})).data;

export const changePost = async (post:Post) => (await axiosInstance.put<Post>('/api/post', post)).data;

export const deletePost = async (id: number) => (await axiosInstance.delete(`/api/posts/${id}`)).data;

export const submitReviewPost = async (id: number) => withAuth((await axiosInstance.put(`/api/submit-preview?postId=${id}`)).data);
