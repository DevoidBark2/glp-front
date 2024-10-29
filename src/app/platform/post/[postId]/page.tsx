"use client";
import { Post } from "@/stores/PostStore";
import { useMobxStores } from "@/stores/stores";
import { Breadcrumb, Card, Divider, Button, Input, Avatar, C, List, notification } from "antd";
import { observer } from "mobx-react";
import nextConfig from "next.config.mjs";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

const { TextArea } = Input;

const PostPage = () => {
    const { postId } = useParams();
    const { postStore } = useMobxStores();
    const [currentPost, setCurrentPost] = useState<Post | null>(null);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    useEffect(() => {
        postStore.getPostById(String(postId)).then(response => {
            setCurrentPost(response)
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        });
    }, [postId]);

    const handleCommentSubmit = () => {
        // if (comment.trim()) {
        //     // Логика добавления нового комментария
        //     const newComment = {
        //         author: 'Текущий пользователь',
        //         content: <p>{comment}</p>,
        //         datetime: 'Только что',
        //         avatar: <Avatar src="https://i.pravatar.cc/100?img=5" />
        //     };
        //     setComments([newComment, ...comments]);
        //     setComment("");
        // }
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

                <Card bordered={false} className="mt-6 shadow-lg">
                    {currentPost?.image && (
                        <div className="w-full h-80 overflow-hidden rounded-lg">
                            <Image
                                width={0}
                                height={0}
                                sizes="100vw"
                                style={{ width: '100%', height: 'auto' }}
                                src={`${nextConfig.env?.API_URL}${currentPost.image}`}
                                alt={currentPost.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <h1 className="text-3xl font-bold mt-4">{currentPost?.name}</h1>
                    <p className="text-gray-600 mt-2">{currentPost?.description}</p>
                    <Divider />
                    <div
                        className="prose max-w-none mt-4"
                        dangerouslySetInnerHTML={{ __html: currentPost?.content || "" }}
                    />
                </Card>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Комментарии</h2>
                    <Card>
                        <List
                            className="comment-list"
                            itemLayout="horizontal"
                            dataSource={comments}
                            renderItem={(item) => (
                                <li>
                                    {item.author}
                                </li>
                            )}
                        />
                    </Card>

                    <Card className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Добавить комментарий</h3>
                        <TextArea
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Напишите ваш комментарий здесь..."
                        />
                        <div className="flex justify-end mt-2">
                            <Button
                                type="primary"
                                onClick={handleCommentSubmit}
                                disabled={!comment.trim()}
                            >
                                Отправить
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default observer(PostPage);