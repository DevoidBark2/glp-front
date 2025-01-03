import { action, makeAutoObservable } from "mobx";
import { Post, postMapper } from "./PostStore";
import { GET, PUT } from "@/lib/fetcher";
import { Comments } from "@/app/control-panel/manage-posts/page";
import { notification } from "antd";
import { PostStatusEnum } from "@/shared/api/posts/model";

class ModeratorStore {
    constructor() {
        makeAutoObservable(this);
    }

    postForModerators: Post[] = [];

    getPostForModerators = action(async () => {
        await GET('/api/post-for-moderators').then(response => {
            this.postForModerators = response.data.map(postMapper)
        })
    })

    updatePostStatus = action(async (postId: number, status: PostStatusEnum, comment: string, comments: Comments) => {
        await PUT('/api/update-post-status', {
            postId: postId,
            status: status,
            comment: comment,
            comments: comments
        }).then(response => {
            notification.success({ message: response.message })
        }).catch(e => {

        })
    })
}

export default ModeratorStore;