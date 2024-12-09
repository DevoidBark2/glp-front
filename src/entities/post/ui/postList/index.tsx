import { Spin } from "antd";
import { PostRow } from "../postRow";
import { Post } from "@/shared/api/posts/model";
import Image from "next/image";

type PostListProps = {
    loading: boolean;
    posts: Post[];
};

export const PostList = ({ loading, posts }: PostListProps) => {
    return (
        <div className="flex items-start">
            <div className="flex flex-col w-full lg:w-3/4 mx-auto">
                {!loading ? (
                    posts.length > 0 ? (
                        posts.map(post => (
                            <PostRow key={post.id} post={post} />
                        ))
                    ) : (
                        <div className="text-center py-10 flex flex-col items-center">
                           <Image
                                src="/static/empty-icon.svg"
                                alt="Empty"
                                width={150}
                                height={150}
                           />
                            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Посты не найдены</h2>
                            <p className="text-gray-600">Не переживайте, контент скоро появится. Пожалуйста, вернитесь позже!</p>
                        </div>
                    )
                ) : (
                    <div className="text-center py-10">
                        <Spin size="large" />
                    </div>
                )}
            </div>
        </div>
    );
};
