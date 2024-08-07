"use client"
import {useMobxStores} from "@/stores/stores";
import {observer} from "mobx-react";
import React, {useEffect, useState} from "react";
import {Button, Carousel, Checkbox, DatePicker, Empty, Image, Input, Select, Spin, Watermark} from "antd"
import EmojiPicker from "emoji-picker-react";

const PlatformPage = () => {

    const {postStore} = useMobxStores()
    const [emojiItem,setEmojiItem] = useState<string | null>(null)

    const contentStyle: React.CSSProperties = {
        margin: 0,
        height: '160px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
    };

    const { RangePicker } = DatePicker;

    useEffect(() => {
       postStore.getAllPosts?.()
    },[])

    return(
        <div className="container mx-auto">
            <div className="px-6">
                <Carousel
                    className="mt-6"
                    arrows
                    infinite={true}
                    autoplay={true}
                    autoplaySpeed={5000}
                >
                    <div>
                        <h3 style={contentStyle}>1</h3>
                    </div>
                    <div>
                        <h3 style={contentStyle}>2</h3>
                    </div>
                    <div>
                        <h3 style={contentStyle}>3</h3>
                    </div>
                    <div>
                        <h3 style={contentStyle}>4</h3>
                    </div>
                </Carousel>
                <p className="mt-6 text-4xl mb-6">Новости</p>
                <div className="flex items-start">
                    <div className="flex flex-col w-3/4">
                        {!postStore.loading ? postStore.allPosts.length > 0 ? postStore.allPosts?.map(post => (
                            <div key={post.id}
                                 className="p-5 relative flex mb-20 cursor-pointer rounded-md shadow-xl"
                            >
                                {!post.image ? <Watermark content={["GLP","Graph Learning Platform"]}>
                                    <div style={{ height: 300,width:500 }} />
                                </Watermark> : <Image
                                    src={`http://localhost:5000${post.image}`}
                                    width={500} height="auto" alt={post.name}
                                />}
                                <div className="ml-5 flex w-full">
                                    <div className="flex w-full justify-between">
                                        <div>
                                            <div className="text-3xl font-semibold">{post.name}</div>
                                            <p className="">{post.content}</p>
                                        </div>
                                        <p className="text-gray-400" title="Дата публикации">{post.publish_date.toString()}</p>
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
                        )) : <Empty description="Список пуст"/> : <Spin/>}
                    </div>
                    <div className="w-1/4 bg-[#f5f5f5] ml-5 rounded flex flex-col gap-2 items-start p-4">
                        <h1>Поиск и фильтры</h1>
                        <Input placeholder='Поиск...'/>
                        <RangePicker className="w-full" placeholder={["Начало","Конец"]}/>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Выберите категории"
                            defaultValue={['a10', 'c12']}
                            options={[{label: "1",value:1}]}
                        />
                        <div className="flex flex-col">
                            <Checkbox value="A">A</Checkbox>
                            <Checkbox value="B">B</Checkbox>
                            <Checkbox value="C">C</Checkbox>
                            <Checkbox value="D">D</Checkbox>
                        </div>
                        <div className="flex justify-end w-full">
                            <Button danger color="red" type="primary">Сбросить</Button>
                            <Button type="primary" className="ml-3">Применить</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default observer(PlatformPage);