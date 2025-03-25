import React from "react";
import Image from "next/image";
import Link from "next/link";

import nextConfig from "next.config.mjs";
import { Post } from "@/shared/api/posts/model";


type PostProps = {
    post: Post;
};

export const PostRow = ({ post }: PostProps) => (
        <div className="p-5 mb-4 bg-gray-50 rounded-lg transition-all hover:bg-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
                {post.image ? (
                    <div className="w-full sm:w-1/3 lg:w-2/3 h-48 rounded-lg overflow-hidden">
                        <Image
                            src={`${nextConfig.env?.API_URL}${post.image}`}
                            alt={post.name}
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-full lg:w-2/3 h-48 object-cover"
                            priority
                        />
                    </div>
                ) : (
                    <div className="w-full sm:w-1/3 h-48 flex items-center justify-center bg-gray-200 rounded-lg">
                        <span className="text-gray-400 text-sm">Нет изображения</span>
                    </div>
                )}

                <div className="flex flex-col justify-between w-full">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">{post.name}</h2>
                        <p className="text-gray-600 text-sm line-clamp-2">{post.description}</p>
                    </div>
                    <div className="flex justify-end">
                        <Link href={`/platform/post/${post.id}`} className="self-start mt-3">
                            <button className="text-sm text-gray-700 hover:text-black transition">Читать далее →</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
