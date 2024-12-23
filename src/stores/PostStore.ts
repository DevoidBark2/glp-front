import { action, makeAutoObservable, runInAction } from "mobx";
import { DELETE, GET, POST, PUT } from "@/lib/fetcher";
import { notification } from "antd"
import dayjs from "dayjs";
import { FORMAT_VIEW_DATE } from "@/shared/constants";
import { PostCreateForm, PostStatusEnum } from "@/shared/api/posts/model";
import { createPost } from "@/shared/api/posts";
import { User } from "@/shared/api/user/model";


export type ModeratorFeedback = {
    id: number;
    comment: string;
    comments: Object
}

export type Post = {
    id: number;
    name: string;
    image: string;
    description: string;
    content: string;
    status: PostStatusEnum;
    is_publish: boolean;
    rejectReason?: string[];
    created_at: Date;
    user: User
    moderatorFeedBack?: ModeratorFeedback
}
class PostStore {
    constructor() {
        makeAutoObservable(this, {});
    }

    allPosts: Post[] = []
    userPosts: Post[] = [];
    loading: boolean = false;

    setLoading = action((value: boolean) => {
        this.loading = value;
    })

    createPostModal: boolean = false;

    setCreatePostModal = action((value: boolean) => {
        this.createPostModal = value;
    })
    getAllPosts = action(async () => {
        this.setLoading(true);
        await GET(`/api/posts`).then(response => {
            this.allPosts = response.response.data.map(postMapper)
        }).catch(e => { }).finally(() => {
            this.setLoading(false);
        })
    })

    getUserPosts = action(async () => {
        this.setLoading(true);
        await GET(`/api/posts-user`).then(response => {
            this.userPosts = response.data.map(postMapper)
        }).catch(e => { }).finally(() => {
            this.setLoading(false);
        })
    })

    createPost = action(async (values: PostCreateForm) => {
        await createPost(values).then(response => {
            runInAction(() => {
                this.userPosts = [...this.userPosts, postMapper(response.data)];
                notification.success({ message: response.message });
            })
        }).finally(() => {
            this.setLoading(false)
            this.setCreatePostModal(false)
        })
    })

    deletePost = action(async (postId: number) => {
        await DELETE(`/api/posts?postId=${postId}`).then((response) => {
            this.userPosts = this.userPosts.filter(post => post.id !== postId);
            notification.success({ message: response.message })
        }).catch(e => {
        })
    })

    submitReview = action(async (postId: number) => {
        await PUT(`/api/submit-preview?postId=${postId}`).then(response => {
            const changedPostIndex = this.userPosts.findIndex(post => post.id === postId);

            if (changedPostIndex !== -1) {
                const updatedPosts = [...this.userPosts];
                updatedPosts[changedPostIndex] = {
                    ...updatedPosts[changedPostIndex],
                    status: PostStatusEnum.IN_PROCESSING
                };
                this.userPosts = updatedPosts;
                notification.success({ message: response.message });
            }
        }).catch()
    })


    getPostById = action(async (postId: string) => {
        return await GET(`/api/post?postId=${postId}`).then(response => {
            return response.data
        }).catch(e => {

        })
    })

    publishPost = action(async (postId: number, checked: boolean) => {
        await POST('/api/publish-post', { id: postId, checked: checked }).then(response => {
            const changedPostIndex = this.userPosts.findIndex(post => post.id === postId);

            if (changedPostIndex !== -1) {
                const updatedPosts = [...this.userPosts];
                updatedPosts[changedPostIndex] = {
                    ...updatedPosts[changedPostIndex],
                    is_publish: checked
                };
                this.userPosts = updatedPosts;
                notification.success({ message: response.data.message });
            }

        }).catch(e => {

        })
    })

    changePost = action(async (post: Post) => {
        await PUT('/api/post', post).then(response => {
            this.userPosts = this.userPosts.map((item) => {
                if (item.id === post.id) {
                    return { ...item, ...response.data.post }
                }
                else {
                    return item;
                }
            }
            );
            if (response.data.message) {
                notification.warning({ message: response.data.message })
            }
            notification.success({ message: response.message })
        }).catch(e => {
            notification.success({ message: e.response.data.message })
        })
    })
}

export const postMapper = (post: Post) => {
    return {
        id: post.id,
        name: post.name,
        image: post.image,
        description: post.description,
        content: post.content,
        status: post.status,
        is_publish: post.is_publish,
        created_at: dayjs(post.created_at, FORMAT_VIEW_DATE).toDate(),
        user: post.user,
        moderatorFeedBack: post.moderatorFeedBack
    };
}

export default PostStore;