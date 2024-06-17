"use client"
import {useMobxStores} from "@/stores/stores";
import {observer} from "mobx-react";
import {useEffect} from "react";
import {Image} from "antd"

const PlatformPage = () => {

    const {postStore} = useMobxStores()

    useEffect(() => {
       postStore.getAllPosts()
    },[])

    return(
        <div className="container mx-auto">
            {postStore.allPosts.map(post => (
                <div key={post.id}>
                    <div>{post.name}</div>
                    <Image src={`http://localhost:5000${post.image}`} width={100} height="auto" alt={post.name}/>
                </div>
            ))}
        </div>
    );
}

export default observer(PlatformPage);