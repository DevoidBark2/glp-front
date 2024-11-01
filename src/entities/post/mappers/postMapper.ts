import { FORMAT_VIEW_DATE } from "@/shared/constants";
import { Post } from "@/stores/PostStore";
import dayjs from "dayjs";

export const postMapper = (post: Post): Post => {
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