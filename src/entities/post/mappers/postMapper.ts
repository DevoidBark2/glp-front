import { Post } from "@/shared/api/posts/model";

export const postMapper = (post: Post): Post => {
    return {
        id: post.id,
        name: post.name,
        image: post.image,
        description: post.description,
        content: post.content,
        status: post.status,
        is_publish: post.is_publish,
        created_at: post.created_at,
        user: post.user,
        moderatorFeedBack: post.moderatorFeedBack
    };
}