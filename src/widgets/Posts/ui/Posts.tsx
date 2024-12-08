import { PostList } from "@/entities/post/ui/postList"
import { useMobxStores } from "@/shared/store/RootStore";
import { observer } from "mobx-react";

export const Posts = observer(() => {
    const { postStore } = useMobxStores();
    
    return (
        <div className="container mx-auto">
            <div className="px-6">
                <p className="mt-6 text-3xl font-semibold text-gray-800 mb-6">Новости</p>
                <PostList loading={postStore.loading} posts={postStore.allPosts} />
            </div>
        </div>
    )
})