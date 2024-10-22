import { action, makeAutoObservable } from "mobx";
import { Post, postMapper } from "./PostStore";
import { GET } from "@/lib/fetcher";

class ModeratorStore {
    constructor() {
        makeAutoObservable(this);
    }

    postForModerators: Post[] = [];

    getPostForModerators = action(async () => {
        await GET('/api/post-for-moderators').then(response => {
            debugger
            this.postForModerators = response.data.map(postMapper)
        })
    })
}

export default ModeratorStore;