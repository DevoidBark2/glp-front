"use client"
import React from 'react'
import { Card, Avatar, Rate, List, Typography, Divider } from 'antd'
import { UserOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

// Моковые данные
const users = [
    { id: 1, name: 'John Doe', rating: 4.5, points: 230, profileUrl: '' },
    { id: 2, name: 'Jane Smith', rating: 3.9, points: 210, profileUrl: '' },
    { id: 3, name: 'Michael Brown', rating: 5.0, points: 320, profileUrl: '' },
    { id: 4, name: 'Emma White', rating: 4.2, points: 250, profileUrl: '' },
    { id: 5, name: 'Chris Johnson', rating: 3.7, points: 180, profileUrl: '' }
]

const RatingPage = () => {
    return (
        <div className="container mx-auto p-6">
            <Title level={2} className="mb-6">Рейтинг пользователей</Title>
            <Divider />

            <List
                itemLayout="horizontal"
                dataSource={users}
                renderItem={user => (
                    <List.Item className="mb-4">
                        <Card className="w-full p-4 shadow-lg rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Avatar size={64} icon={<UserOutlined />} className="mr-4" />
                                    <div>
                                        <Text className="font-semibold">{user.name}</Text>
                                        <div className="flex items-center mt-1">
                                            <Rate disabled value={user.rating} className="mr-2" />
                                            <Text>{user.rating}</Text>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Text className="text-gray-600">Points:</Text>
                                    <Text className="font-semibold ml-2">{user.points}</Text>
                                </div>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />

            <Divider />

            <Text className="text-center text-gray-500">Showing top users based on points and ratings</Text>
        </div>
    )
}

export default RatingPage
