"use client"
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { useMobxStores } from "@/shared/store/RootStore";
import { PostList } from "@/entities/post/ui/postList";

const PlatformPage = () => {
    const { postStore } = useMobxStores();

    useEffect(() => {
        postStore.getAllPosts()
    }, [])

    return (
        <div className="container mx-auto">
            <div className="px-6">
                <p className="mt-6 text-gray-800 text-4xl mb-6">Новости</p>
                <PostList loading={postStore.loading} posts={postStore.allPosts} />
            </div>
        </div>
    );
}

export default observer(PlatformPage);