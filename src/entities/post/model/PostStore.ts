import { action, makeAutoObservable, runInAction } from "mobx";
import { postMapper } from "../mappers";
import { Post, PostCreateForm, PostStatusEnum } from "@/shared/api/posts/model";
import { changePost, createPost, deletePost, getAllPost, getCPAllPost, getPostById, publishPost, submitReviewPost } from "@/shared/api/posts";
import { notification } from "antd";

class PostStore {
    constructor() {
        makeAutoObservable(this);
    }

    allPosts: Post[] = []
    userPosts: Post[] = [];
    loading: boolean = false;
    createPostModal: boolean = false;

    setLoading = action((value: boolean) => {
        this.loading = value;
    })

    setCreatePostModal = action((value: boolean) => {
        this.createPostModal = value;
    })

    getAllPosts = action(async () => {
        try {
            this.setLoading(true);
            const data = await getAllPost();
            runInAction(() => {
                this.allPosts = data.map(postMapper);
            })
        } catch (e) {

        } finally {
            this.setLoading(false);
        }
    })

    getPostById = action(async (postId: number) => {
        try {
            return await getPostById(postId);
        } catch (e) {

        } finally {

        }
    })

    getUserPosts = action(async () => {
        try {
            this.setLoading(true);
            const data = await getCPAllPost();
            this.userPosts = data.map(postMapper);
        } catch (e) {

        } finally {
            this.setLoading(false)
        }
    })

    createPost = action(async (values: PostCreateForm) => {
        try {
            this.setLoading(true)
            const data = await createPost(values);

            this.userPosts = [...this.userPosts, postMapper(data)];
            //notification.success({ message: response.message });
        } catch (e) {

        } finally {
            this.setLoading(false)
            this.setCreatePostModal(false)
        }
    })

    deletePost = action(async (id: number) => {
        await deletePost(id).then(response => {
            notification.success({ message: response.message })
            this.userPosts = this.userPosts.filter(post => post.id !== id);
        });
    })

    submitReview = action(async (postId: number) => {
        await submitReviewPost(postId);
        const changedPostIndex = this.userPosts.findIndex(post => post.id === postId);

        if (changedPostIndex !== -1) {
            const updatedPosts = [...this.userPosts];
            updatedPosts[changedPostIndex] = {
                ...updatedPosts[changedPostIndex],
                status: PostStatusEnum.IN_PROCESSING
            };
            this.userPosts = updatedPosts;
            // notification.success({ message: response.message });
        }
        // await PUT(`/api/submit-preview?postId=${postId}`).then(response => {

        // }).catch()
    })



    publishPost = action(async (postId: number, checked: boolean) => {
        try {
            await publishPost(postId, checked);
            const changedPostIndex = this.userPosts.findIndex(post => post.id === postId);

            if (changedPostIndex !== -1) {
                const updatedPosts = [...this.userPosts];
                updatedPosts[changedPostIndex] = {
                    ...updatedPosts[changedPostIndex],
                    is_publish: checked
                };
                this.userPosts = updatedPosts;
                //notification.success({ message: response.data.message });
            }
        } catch (e) {

        }
    })

    changePost = action(async (post: Post) => {
        const data = await changePost(post);
        this.userPosts = this.userPosts.map((item) => {
            if (item.id === post.id) {
                return { ...item, ...data }
            }
            else {
                return item;
            }
        }
        );
        notification.success({ message: data.message })
    })
}

export default PostStore;