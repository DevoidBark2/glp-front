"use client";
import { Post } from "@/stores/PostStore";
import { Breadcrumb, notification } from "antd";
import { observer } from "mobx-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useMobxStores } from "@/shared/store/RootStore";
import { PostCard } from "@/entities/post";

export type Comment = {
    author: string;
    content: string;
    datetime: number;
    avatar: string;
}

const PostPage = () => {
    const { postId } = useParams();
    const { postStore } = useMobxStores();
    const [currentPost, setCurrentPost] = useState<Post | null>(null);

    useEffect(() => {
        postStore.getPostById(Number(postId)).then(response => {
            setCurrentPost(response!)
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        });
    }, [postId]);

    return (
        <div className="container mx-auto">
            <div className="px-6">
                <div className="mt-4">
                    <Breadcrumb items={[
                        {
                            title: <Link href={"/platform"}>Главная</Link>,
                        },
                        {
                            title: <Link href={`/platform/post/${postId}`}>{currentPost?.name || "Пост"}</Link>,
                        }
                    ]} />
                </div>
                <PostCard post={currentPost!} />
            </div>
        </div>
    );
};

export default observer(PostPage);
