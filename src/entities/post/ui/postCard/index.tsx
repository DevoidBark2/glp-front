import { Post } from "@/shared/api/posts/model";
import { FORMAT_VIEW_DATE } from "@/shared/constants";
import { Card, Divider } from "antd";
import dayjs from "dayjs";
import nextConfig from "next.config.mjs";
import Image from "next/image";

type PostCardProps = {
    post: Post
}

export const PostCard = ({ post }: PostCardProps) => {
    return (
        <Card variant="borderless" className="mt-6 shadow-lg p-6">
            <div className="flex flex-col sm:flex-row">

                {post?.image && (
                    <div className="flex-shrink-0 w-full sm:w-1/3 h-64 overflow-hidden rounded-lg mb-4 sm:mb-0 sm:mr-6">
                        <Image
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: '100%', height: 'auto' }}
                            src={`${nextConfig.env?.API_URL}${post?.image}`}
                            alt={post?.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="flex-grow">
                    <h1 className="text-3xl font-bold mb-2 break-words">{post?.name}</h1>
                    <p className="text-gray-600 mb-4">{post?.description}</p>
                    <p className="text-sm text-gray-500 mt-4">
                        Опубликовано: {dayjs(post?.created_at).format(FORMAT_VIEW_DATE)}
                    </p>
                </div>

            </div>
            <Divider/>
            <div
                className="prose max-w-none my-4"
                dangerouslySetInnerHTML={{__html: post?.content || "" }}
            />
        </Card>
    );
}