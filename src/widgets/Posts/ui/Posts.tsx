"use client"
import { PostList } from "@/entities/post/ui/postList";
import { useMobxStores } from "@/shared/store/RootStore";
import { Divider, Carousel } from "antd";
import { observer } from "mobx-react";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image"
import nextConfig from "next.config.mjs";
import { BookOutlined } from "@ant-design/icons";

export const Posts = observer(() => {
    const { postStore, courseStore } = useMobxStores();

    useEffect(() => {
        postStore.getAllPosts();
        courseStore.getAllCourses(); // Загрузка курсов
    }, []);

    return (
        <div className="container mx-auto">
            <div className="px-6">
                {/* Заголовок и новости */}
                <h1 className="mt-6 text-3xl font-semibold text-gray-800 mb-6">Новости</h1>
                <Divider className="my-6" />
                <PostList loading={postStore.loading} posts={postStore.allPosts} />
            </div>
        </div>
    );
});
