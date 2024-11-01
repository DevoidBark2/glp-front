"use client"
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { PlatformPostItem } from "@/components/PlatformPostItem/PlatformPostItem";
import { Drawer, Button, Divider, Tooltip, Input, DatePicker, Select, Checkbox, Space, Typography, Empty, Spin } from 'antd';
import { SearchOutlined, FilterOutlined, CloseCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useMobxStores } from "@/shared/store/RootStore";

const { Text } = Typography;

const PlatformPage = () => {
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    const toggleFilterDrawer = () => {
        setIsFilterVisible(!isFilterVisible);
    };
    const { postStore } = useMobxStores();
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
                                <PlatformPostItem key={post.id} post={post} />
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

                    <Button
                        type="primary"
                        icon={<FilterOutlined />}
                        onClick={toggleFilterDrawer}
                        className="fixed bottom-8 right-8 lg:hidden"
                    >
                        Фильтры
                    </Button>

                    <Drawer
                        title="Поиск и фильтры"
                        placement="right"
                        onClose={toggleFilterDrawer}
                        open={isFilterVisible}
                        width={320}
                        className="p-4"
                    >
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Input
                                placeholder="Поиск..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                className="rounded-lg border border-gray-300 hover:border-blue-500 transition duration-200 ease-in-out"
                            />
                            
                            <Divider className="border-gray-200" />

                            <Text className="font-semibold text-gray-600">Дата</Text>
                            <RangePicker
                                className="w-full rounded-lg border border-gray-300 hover:border-blue-500 transition duration-200 ease-in-out"
                                placeholder={["Начало", "Конец"]}
                            />

                            <Divider className="border-gray-200" />

                            <Text className="font-semibold text-gray-600">Категории</Text>
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="Выберите категории"
                                className="rounded-lg border border-gray-300 hover:border-blue-500 transition duration-200 ease-in-out"
                                options={[
                                    { label: "Категория 1", value: 1 },
                                    { label: "Категория 2", value: 2 },
                                    { label: "Категория 3", value: 3 },
                                ]}
                            />

                            <Divider className="border-gray-200" />

                            <Text className="font-semibold text-gray-600">Теги</Text>
                            <div className="flex flex-wrap gap-2">
                                {["A", "B", "C", "D"].map(tag => (
                                    <Checkbox key={tag} checked={!!tag} className="hover:text-blue-500 transition duration-200 ease-in-out">
                                        {tag}
                                    </Checkbox>
                                ))}
                            </div>

                            <Divider className="border-gray-200" />

                            <div className="flex justify-end gap-3">
                                <Tooltip title="Сбросить фильтры">
                                    <Button danger icon={<CloseCircleOutlined />}>
                                        Сбросить
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Применить фильтры">
                                    <Button type="primary" icon={<CheckOutlined />}>
                                        Применить
                                    </Button>
                                </Tooltip>
                            </div>
                        </Space>
                    </Drawer>
                </div>
            </div>
        </div>
    );
}

export default observer(PlatformPage);