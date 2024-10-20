"use client"
import { useMobxStores } from "@/stores/stores";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
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
import { CloseCircleOutlined, SearchOutlined, CheckOutlined } from "@ant-design/icons";
import { FORMAT_VIEW_DATE } from "@/constants";
import dayjs from "dayjs";
import nextConfig from "next.config.mjs";
import { useRouter } from "next/navigation";

const PlatformPage = () => {
    const router = useRouter();
    const { postStore } = useMobxStores()
    const { RangePicker } = DatePicker;

    useEffect(() => {
        postStore.getAllPosts()
    }, [])

    return (
        <div className="container mx-auto">
            <div className="px-6">
                <p className="mt-6 text-gray-800 text-4xl mb-6">Новости</p>
                <div className="flex items-start">
                    <div className="flex flex-col w-full lg:w-3/4 mx-auto">
                        {!postStore.loading ? postStore.allPosts.length > 0 ? (
                            postStore.allPosts.map(post => (
                                <div
                                    key={post.id}
                                    onClick={() => router.push(`/platform/post/${post.id}`)}
                                    className="p-6 mb-12 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer relative group"
                                >
                                    <div className="relative flex">
                                        <div className="relative overflow-hidden rounded-lg shadow-sm">
                                            {!post.image ? (
                                                <div className="flex items-center justify-center w-64 h-40 bg-gray-100 rounded-lg">
                                                    <span className="text-gray-400">Изображение отсутствует</span>
                                                </div>
                                            ) : (
                                                <img
                                                    src={`${nextConfig.env?.API_URL}${post.image}`}
                                                    alt={post.name}
                                                    className="w-64 h-40 object-cover rounded-lg transition-transform duration-300 transform group-hover:scale-105"
                                                />
                                            )}
                                        </div>
                                        <div className="ml-6 flex flex-col justify-between w-full">
                                            <div>
                                                <h2 className="text-2xl font-semibold text-gray-800 mb-2 transition-colors duration-300 group-hover:text-gray-900">
                                                    {post.name}
                                                </h2>
                                                <p className="text-gray-600 line-clamp-2 group-hover:text-gray-700">
                                                    {post.description || "Описание недоступно"}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-4"
                                                title="Дата публикации">
                                                Опубликовано: {dayjs(post.created_at).format(FORMAT_VIEW_DATE)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 right-4">
                                        <button
                                            onClick={() => router.push(`/platform/post/${post.id}`)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition-colors duration-300"
                                        >
                                            Читать далее
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <Empty description="Список пуст" />
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <Spin size="large" />
                            </div>
                        )}
                    </div>

                    <div className="w-1/4 bg-white ml-5 rounded-lg shadow-lg flex flex-col gap-4 p-6">
                        <h2 className="text-lg font-semibold text-gray-700">Поиск и фильтры</h2>

                        <Input
                            placeholder='Поиск...'
                            prefix={<SearchOutlined className="text-gray-400" />}
                            className="p-2 rounded border border-gray-300 hover:border-blue-500 transition duration-200 ease-in-out"
                        />

                        <Divider className="border-gray-200" />

                        <RangePicker
                            className="w-full rounded border border-gray-300 hover:border-blue-500 transition duration-200 ease-in-out"
                            placeholder={["Начало", "Конец"]}
                        />

                        <Divider className="border-gray-200" />

                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Выберите категории"
                            className="rounded border border-gray-300 hover:border-blue-500 transition duration-200 ease-in-out"
                            defaultValue={['a10', 'c12']}
                            options={[
                                { label: "Категория 1", value: 1 },
                                { label: "Категория 2", value: 2 },
                                { label: "Категория 3", value: 3 },
                            ]}
                        />

                        <Divider className="border-gray-200" />

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

                        <Divider className="border-gray-200" />

                        <div className="flex justify-end w-full gap-3">
                            <Tooltip title="Сбросить фильтры">
                                <Button
                                    danger
                                    type="primary"
                                    icon={<CloseCircleOutlined />}
                                    className="flex items-center"
                                >
                                    Сбросить
                                </Button>
                            </Tooltip>

                            <Tooltip title="Применить фильтры">
                                <Button
                                    type="primary"
                                    icon={<CheckOutlined />}
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