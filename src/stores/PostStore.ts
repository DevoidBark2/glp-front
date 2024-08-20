import {action, makeAutoObservable} from "mobx";
import {DELETE, GET, POST, PUT} from "@/lib/fetcher";
import {getUserToken} from "@/lib/users";
import {notification} from "antd"
import dayjs, {Dayjs} from "dayjs";

export type Post = {
    id: number;
    name: string;
    image: string;
    content: string;
    publish_date: Dayjs;
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
        form.append('image',values.image.originFileObj)
        form.append('name',values.title)
        form.append('content',values.content)
        form.append('publish_date',dayjs().format('YYYY-MM-DD HH:mm'))

        this.setLoading(true)
        return await POST(`/api/posts?token=${token}`,form).then(response => {
            notification.success({message: response.response.message})
            this.pushPost(postMapper(response.response.post));
        }).finally(() => {
            this.setLoading(false)
            this.setCreatePostModal(false)
        })
    })

    pushPost = action((value: any) => {
        this.allPosts = [...this.allPosts, value]
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
        content: post.content,
        publish_date: dayjs(post.publish_date)
    };
}

export default PostStore;