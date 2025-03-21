import React, { useEffect } from "react";
import { Divider } from "antd";
import { observer } from "mobx-react";

import { useMobxStores } from "@/shared/store/RootStore";
import { PostList } from "@/entities/post/ui/postList";

export const Posts = observer(() => {
    const { postStore } = useMobxStores();

    useEffect(() => {
        postStore.getAllPosts();
    }, []);

    return (
        <div className="container mx-auto px-4">
            <div className="px-2">
                <h1 className="text-3xl my-6 font-semibold">Обзор новостей</h1>
                <Divider/>
                <PostList loading={postStore.loading} posts={postStore.allPosts} />
            </div>
        </div>
    );
});
