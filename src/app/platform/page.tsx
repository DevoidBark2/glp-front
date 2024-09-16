"use client"
import {useMobxStores} from "@/stores/stores";
import {observer} from "mobx-react";
import React, {useEffect, useState} from "react";
import {
    Button,
    Carousel,
    Checkbox,
    DatePicker,
    Divider,
    Empty,
    Input,
    Select,
    Spin,
    Tooltip,
    Watermark
} from "antd"
import EmojiPicker from "emoji-picker-react";
import {CloseCircleOutlined, SearchOutlined} from "@ant-design/icons";
import {FORMAT_VIEW_DATE} from "@/constants";
import dayjs from "dayjs";

function CheckOutlined() {
    return null;
}

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
       postStore.getAllPosts()
    },[])

    return(
        <div className="container mx-auto">
            <div className="px-6">
                {/*<Carousel*/}
                {/*    className="mt-6"*/}
                {/*    arrows*/}
                {/*    infinite={true}*/}
                {/*    autoplay={true}*/}
                {/*    autoplaySpeed={5000}*/}
                {/*>*/}
                {/*    <div>*/}
                {/*        <h3 style={contentStyle}>1</h3>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <h3 style={contentStyle}>2</h3>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <h3 style={contentStyle}>3</h3>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <h3 style={contentStyle}>4</h3>*/}
                {/*    </div>*/}
                {/*</Carousel>*/}
                <p className="mt-6 text-gray-800 text-4xl mb-6">Новости</p>
                <div className="flex items-start">
                    <div className="flex flex-col w-3/4">
                        {!postStore.loading ? postStore.allPosts.length > 0 ? postStore.allPosts?.map(post => (
                            <div key={post.id}
                                 className="p-5 relative flex mb-20 cursor-pointer rounded-md shadow-xl"
                            >
                                {!post.image ? <Watermark content={["GLP", "Graph Learning Platform"]}>
                                <div style={{height: 300, width: 500}}/>
                                </Watermark> : <img
                                src={`http://localhost:4200${post.image}`}
                                width={500} height="200" alt={post.name}
                                />}
                                <div className="ml-5 flex w-full">
                                    <div className="flex w-full justify-between">
                                        <div>
                                            <div className="text-3xl font-semibold">{post.name}</div>
                                            <div dangerouslySetInnerHTML={{__html: post.content}}></div>
                                        </div>
                                        <p className="text-gray-400"
                                           title="Дата публикации">{dayjs(post.created_at).format(FORMAT_VIEW_DATE)}</p>
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
                    <div className="w-1/4 bg-white ml-5 rounded-lg shadow-lg flex flex-col gap-4 p-6">
                        <h2 className="text-lg font-semibold text-gray-700">Поиск и фильтры</h2>

                        <Input
                            placeholder='Поиск...'
                            prefix={<SearchOutlined className="text-gray-400"/>}
                            className="p-2 rounded border border-gray-300 hover:border-blue-500 transition duration-200 ease-in-out"
                        />

                        <Divider className="border-gray-200"/>

                        <RangePicker
                            className="w-full rounded border border-gray-300 hover:border-blue-500 transition duration-200 ease-in-out"
                            placeholder={["Начало", "Конец"]}
                        />

                        <Divider className="border-gray-200"/>

                        <Select
                            mode="multiple"
                            allowClear
                            style={{width: '100%'}}
                            placeholder="Выберите категории"
                            className="rounded border border-gray-300 hover:border-blue-500 transition duration-200 ease-in-out"
                            defaultValue={['a10', 'c12']}
                            options={[
                                {label: "Категория 1", value: 1},
                                {label: "Категория 2", value: 2},
                                {label: "Категория 3", value: 3},
                            ]}
                        />

                        <Divider className="border-gray-200"/>

                        <div className="flex flex-col space-y-2">
                            <Checkbox value="A"
                                      className="hover:text-blue-500 transition duration-200 ease-in-out">A</Checkbox>
                            <Checkbox value="B"
                                      className="hover:text-blue-500 transition duration-200 ease-in-out">B</Checkbox>
                            <Checkbox value="C"
                                      className="hover:text-blue-500 transition duration-200 ease-in-out">C</Checkbox>
                            <Checkbox value="D"
                                      className="hover:text-blue-500 transition duration-200 ease-in-out">D</Checkbox>
                        </div>

                        <Divider className="border-gray-200"/>

                        <div className="flex justify-end w-full gap-3">
                            <Tooltip title="Сбросить фильтры">
                                <Button
                                    danger
                                    type="primary"
                                    icon={<CloseCircleOutlined/>}
                                    className="flex items-center"
                                >
                                    Сбросить
                                </Button>
                            </Tooltip>

                            <Tooltip title="Применить фильтры">
                                <Button
                                    type="primary"
                                    icon={<CheckOutlined/>}
                                    className="flex items-center"
                                >
                                    Применить
                                </Button>
                            </Tooltip>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default observer(PlatformPage);