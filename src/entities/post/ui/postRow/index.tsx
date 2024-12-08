import nextConfig from "next.config.mjs";
import dayjs from "dayjs";
import Image from "next/image";
import { FORMAT_VIEW_DATE } from "@/shared/constants";
import { Post } from "@/shared/api/posts/model";
import Link from "next/link";

type PostProps = {
    post: Post
}

export const PostRow = ({ post }: PostProps) => {
    return (
        <div
            key={post.id}
            className="p-6 mb-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 relative group flex items-start"
        >
            {!post.image ? (
                <div className="flex-shrink-0 w-full sm:w-1/3 h-64 overflow-hidden mb-4 sm:mb-0 sm:mr-6 flex items-center justify-center w-200 bg-gray-100 rounded-lg">
                    <span className="text-gray-400">Изображение отсутствует</span>
                </div>
            ) : (
                <div className="flex-shrink-0 w-full sm:w-1/3 h-64 overflow-hidden rounded-lg mb-4 sm:mb-0 sm:mr-6">
                    <Image
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: '100%', height: 'auto' }}
                        src={`${nextConfig.env?.API_URL}${post?.image}`}
                        alt={post?.name}
                        priority
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            <div className="flex flex-col justify-between w-full">
                <div className="flex justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2 transition-colors duration-300 line-clamp-1">
                            {post.name}
                        </h2>
                        <p className="text-gray-600 line-clamp-2">
                            {post.description}
                        </p>
                    </div>

                </div>

                <div className="absolute right-5 bottom-5">
                    <Link href={`/platform/post/${post.id}`}>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition-colors duration-300">
                            Читать далее
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
