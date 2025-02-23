import { Skeleton } from "antd";
import { PostRow } from "../postRow";
import { Post } from "@/shared/api/posts/model";
import Image from "next/image";

interface PostListProps {
    loading: boolean;
    posts: Post[];
}

export const PostList = ({ loading, posts }: PostListProps) => {
    return (
        <div className="flex justify-center">
            <div className="w-full max-w-5xl">
                {!loading ? (
                    posts.length > 0 ? (
                        posts.map(post => <PostRow key={post.id} post={post} />)
                    ) : (
                        <div className="text-center py-10 flex flex-col items-center">
                            <Image
                                src="/static/empty-icon.svg"
                                alt="Empty"
                                width={100}
                                height={100}
                                className="mb-4 opacity-70"
                            />
                            <h2 className="text-xl font-medium text-gray-700">Посты не найдены</h2>
                            <p className="text-gray-500 text-sm">Контент скоро появится, загляните позже.</p>
                        </div>
                    )
                ) : (
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded-lg">
                                <Skeleton active paragraph={{ rows: 2 }} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
