"use client"
import {useMobxStores} from "@/stores/stores";
import {observer} from "mobx-react";
import {useEffect, useState} from "react";
import {Image} from "antd"
import EmojiPicker from "emoji-picker-react";
import {EmojiType} from "next/dist/compiled/@vercel/og/emoji";

const PlatformPage = () => {

    const {postStore} = useMobxStores()
    const [emojiItem,setEmojiItem] = useState<string>(null)

    useEffect(() => {
       postStore.getAllPosts?.()
    },[])

    return(
        <div className="container mx-auto">
            <div className="px-6">
                <p className="mt-6 text-4xl mb-6">Новости</p>
                <div className="flex flex-col">
                    {postStore.allPosts?.map(post => (
                        <div key={post.id}
                             className="p-5 relative flex mb-20 cursor-pointer rounded-md shadow-xl"
                        >
                            <Image
                                src={`http://localhost:5000${post.image}`}
                                width={500} height="auto" alt={post.name}
                            />
                            <div className="ml-5 flex flex-col justify-start">
                                <div>
                                    <div className="text-3xl font-semibold">{post.name}</div>
                                    <p className="">{post.content}</p>
                                </div>

                                <div className="absolute bottom-5 right-5">
                                    <div className="flex flex-col">
                                        <EmojiPicker
                                            reactionsDefaultOpen={true}
                                            allowExpandReactions={false}
                                            onReactionClick={(emoji, event) => {
                                                setEmojiItem(emoji.emoji)
                                                postStore.addReactionPost(emoji.emoji)
                                            }}
                                        />
                                        <span className="text-2xl text-center">{emojiItem && emojiItem}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default observer(PlatformPage);