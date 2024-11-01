"use client";
import { Post } from "@/stores/PostStore";
import { Breadcrumb, Card, Divider, Button, Input, List, notification, Avatar } from "antd";
import { observer } from "mobx-react";
import nextConfig from "next.config.mjs";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useMobxStores } from "@/shared/store/RootStore";
import dayjs from "dayjs";
import { FORMAT_VIEW_DATE } from "@/shared/constants";
import { PostCard } from "@/entities/post";
import { CommentsBlock } from "@/shared/ui";

const { TextArea } = Input;

const PostPage = () => {
    const { postId } = useParams();
    const { postStore } = useMobxStores();
    const [currentPost, setCurrentPost] = useState<Post | null>(null);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        postStore.getPostById(Number(postId)).then(response => {
            setCurrentPost(response!)
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        });
    }, [postId]);

    const handleCommentSubmit = (comment: string) => {
        debugger
        if (comment.trim()) {
            // Логика добавления нового комментария
            const newComment = {
                author: 'Текущий пользователь',
                content: <p>{comment}</p>,
                datetime: 'Только что',
                avatar: <Avatar src="https://i.pravatar.cc/100?img=5" />
            };
            setComments([newComment, ...comments]);
        }
    };

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

                <CommentsBlock handleCommentSubmit={handleCommentSubmit} comments={comments} />
            </div>
        </div>
    );
};

export default observer(PostPage);
