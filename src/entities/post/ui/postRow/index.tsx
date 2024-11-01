import nextConfig from "next.config.mjs";
import dayjs from "dayjs";
import Image from "next/image";
import { FORMAT_VIEW_DATE } from "@/shared/constants";
import { Post } from "@/shared/api/posts/model";
import Link from "next/link";

export const PostRow = (post: Post) => {
    return (
        <div
        key={post.id}
        className="p-6 mb-12 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer relative group"
    >
    <div className="relative flex">
        <div className="relative rounded-lg shadow-sm">
            {!post.image ? (
                <div className="flex items-center justify-center w-64 h-40 bg-gray-100 rounded-lg">
                    <span className="text-gray-400">Изображение отсутствует</span>
                </div>
            ) : (
                <Image
                    src={`${nextConfig.env?.API_URL}${post.image}`}
                    alt={post.name}
                    priority={true}
                    width={500}
                    height={350}
                    className="object-cover rounded-lg transition-transform duration-300 transform group-hover:scale-105"
                />
            )}
        </div>
        <div className="ml-6 flex flex-col justify-between w-full">
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2 transition-colors duration-300 group-hover:text-gray-900">
                    {post.name}
                </h2>
                <p className="text-gray-600 line-clamp-2 group-hover:text-gray-700">
                    {post.description || "Описание недоступно"}
                </p>
            </div>
            <p className="text-sm text-gray-500 mt-4"
                title="Дата публикации">
                Опубликовано: {dayjs(post.created_at).format(FORMAT_VIEW_DATE)}
            </p>
        </div>
    </div>
    <div className="absolute bottom-4 right-4">
        <Link href={`/platform/post/${post.id}`}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition-colors duration-300">
                Читать далее
            </button>
        </Link>
    </div>
</div>
    );
}