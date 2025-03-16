"use client";
import { Breadcrumb, Button, notification } from "antd";
import { observer } from "mobx-react";
import { useParams , useRouter } from "next/navigation";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { useMobxStores } from "@/shared/store/RootStore";
import { PostCard } from "@/entities/post";
import { Post } from "@/shared/api/posts/model";


const PostPage = () => {
    const { postId } = useParams();
    const { postStore } = useMobxStores();
    const [currentPost, setCurrentPost] = useState<Post | null>(null);
    const router = useRouter()
    const { resolvedTheme } = useTheme()

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
                <Breadcrumb
                    items={[
                        {
                            title: <Button icon={<ArrowLeftOutlined />} color="default" type="link" variant="link"
                                onClick={() => router.push("/platform/blog")}
                                style={{ color: resolvedTheme === "dark" ? "white" : "black" }}
                            >Обзор новостей</Button>
                        }
                    ]}
                />
                <PostCard post={currentPost!} />
            </div>
        </div>
    );
};

export default observer(PostPage);
