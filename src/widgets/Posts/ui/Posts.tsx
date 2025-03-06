import { PostList } from "@/entities/post/ui/postList";
import { useMobxStores } from "@/shared/store/RootStore";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Divider } from "antd";
import { observer } from "mobx-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const Posts = observer(() => {
    const { postStore } = useMobxStores();
    const { resolvedTheme } = useTheme()
    const router = useRouter()

    useEffect(() => {
        postStore.getAllPosts();
    }, []);

    return (
        <div className="container mx-auto px-4">
            <div className="px-2">
                <Breadcrumb
                    items={[
                        {
                            className: "dark:text-white",
                            title: <Button icon={<ArrowLeftOutlined />} color="default" type="link" variant="link"
                                onClick={() => router.push("/platform")}
                                style={{ color: resolvedTheme === "dark" ? "white" : "black" }}
                            >Главная</Button>
                        },
                    ]}
                />

                <h1 className="text-3xl my-6 font-semibold">Обзор новостей</h1>
                <Divider/>
                <PostList loading={postStore.loading} posts={postStore.allPosts} />
            </div>
        </div>
    );
});
