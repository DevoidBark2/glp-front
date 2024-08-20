import {action, makeAutoObservable} from "mobx";
import {DELETE, GET, POST, PUT} from "@/lib/fetcher";
import {getUserToken} from "@/lib/users";
import {notification} from "antd"
import dayjs, {Dayjs} from "dayjs";
import {PostStatusEnum} from "@/enums/PostStatusEnum";

export type Post = {
    id: number;
    name: string;
    image: string;
    description: string;
    content: string;
    status: PostStatusEnum;
    is_publish: boolean;
    created_at: Dayjs;
}
class PostStore{
    constructor(){
        makeAutoObservable(this, {});
    }

    allPosts: Post[] = []

    loading: boolean = false;

    setLoading = action((value:boolean) => {
        this.loading = value;
    })

    createPostModal: boolean = false;

    setCreatePostModal = action((value:boolean) => {
        this.createPostModal = value;
    })
    getAllPosts = action(async () => {
        this.setLoading(true);
        await GET(`/api/posts`).then(response => {
            this.allPosts = response.response.data.map(postMapper)
        }).catch(e => {}).finally(() => {
            this.setLoading(false);
        })
    })

    createPost = action(async (values: any) => {
        const token = getUserToken();
        const form = new FormData();
        //form.append('image',values.image.originFileObj)
        form.append('name',values.name)
        form.append('description',values.description);
        form.append('content',values.content)

        this.setLoading(true)
        return await POST(`/api/posts?token=${token}`,form).then(response => {
            this.allPosts = [...this.allPosts, postMapper(response.response.data)]
            notification.success({message: response.response.message})
        }).finally(() => {
            this.setLoading(false)
            this.setCreatePostModal(false)
        })
    })

    addReactionPost = action(async (emoji:string) => {
        await PUT('/api/post',emoji).then(response => {

        })
    })

    deletePost = action(async (postId: number) => {
        const token = getUserToken();
        await DELETE(`/api/posts?postId=${postId}&token=${token}`).then(() => {

        }).catch(e => {

        })
    })
}

const postMapper = (post: Post) => {
    return {
        id: post.id,
        name: post.name,
        image: post.image,
        description: post.description,
        content: post.content,
        status: post.status,
        is_publish: post.is_publish,
        publish_date: dayjs(post.created_at)
    };
}

export default PostStore;