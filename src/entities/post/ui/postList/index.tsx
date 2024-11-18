import { Empty, Spin } from "antd"
import { PostRow } from "../postRow"
import { Post } from "@/shared/api/posts/model";

type PostListProps = {
    loading: boolean;
    posts: Post[]
}

export const PostList = ({ loading, posts }: PostListProps) => {
    return (
        <div className="flex items-start">
            <div className="flex flex-col w-full lg:w-3/4 mx-auto">
                {!loading ? posts.length > 0 ? (
                    posts.map(post => (
                        <PostRow key={post.id} post={post} />
                    ))
                ) : (
                    <div className="text-center py-10">
                        <Empty description="Список пуст" />
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <Spin size="large" />
                    </div>
                )}
            </div>
        </div>
    )
}