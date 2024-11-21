"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Card, Descriptions, Divider, Tag, Typography, Spin, Button, Avatar, List, Popconfirm, Breadcrumb, Collapse } from "antd";
import { useMobxStores } from "@/stores/stores";
import { useParams, useRouter } from "next/navigation";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import nextConfig from "next.config.mjs";
import { StatusUserEnum, User, UserRole } from "@/shared/api/user/model";
import { Course } from "@/shared/api/course/model";

const { Title, Text } = Typography;

const UserDetailsPage = () => {
    const { userId } = useParams();
    const router = useRouter();
    const { userStore } = useMobxStores();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (userId) {
            userStore.getUserById(Number(userId))
                .then(setUser)
                .finally(() => setLoading(false));
        }
    }, [userId, userStore]);

    const handleBlockUser = () => {
        // Логика блокировки пользователя
        console.log("Пользователь заблокирован");
    };

    const renderTag = (role: UserRole | undefined, status: StatusUserEnum | undefined) => (
        <>
            <Tag color={role === UserRole.TEACHER ? "blue" : role === UserRole.MODERATOR ? "purple" : "green"}>
                {role === UserRole.TEACHER ? "Преподаватель" : role === UserRole.MODERATOR ? "Модератор" : "Пользователь"}
            </Tag>
            <Tag color={status ? "green" : "red"}>{status ? "Активен" : "Не активен"}</Tag>
        </>
    );

    const renderCourses = (courses: Course[], isTeacher: boolean) => {
        if (!courses || courses.length === 0) {
            return (
                <Text type="secondary" className="block text-center">
                    {isTeacher ? "Преподаватель не создал курсы." : "Пользователь не подписан на курсы."}
                </Text>
            );
        }
    
        return (
            <List
                itemLayout="horizontal"
                dataSource={courses}
                renderItem={(course) => (
                    <List.Item>
                        <Collapse
                            bordered={false}
                            className="w-full"
                            expandIconPosition="end"
                        >
                            <Collapse.Panel
                                header={
                                    <div className="flex items-center space-x-4">
                                        <Avatar
                                            src={course.image || "/default-course-image.jpg"}
                                            size={64}
                                            shape="square"
                                        />
                                        <div>
                                            <Typography.Text strong>{course.name}</Typography.Text>
                                            <br />
                                            <Typography.Text type="secondary" ellipsis>
                                                {course.small_description || "Описание отсутствует"}
                                            </Typography.Text>
                                        </div>
                                    </div>
                                }
                                key={course.id}
                            >
                                <div className="p-4 bg-gray-50 rounded-md">
                                    <Typography.Paragraph>
                                        <strong>Категория:</strong> {course.category?.name || "Не указано"}
                                    </Typography.Paragraph>
                                    <Typography.Paragraph>
                                        <strong>Длительность:</strong> {course.duration} часов
                                    </Typography.Paragraph>
                                    <Typography.Paragraph>
                                        <strong>Опубликован:</strong>{" "}
                                        {course.publish_date ? new Date(course.publish_date).toLocaleDateString() : "Не указано"}
                                    </Typography.Paragraph>
                                    <Typography.Paragraph>
                                        <strong>Описание:</strong> {course.content_description || "Нет информации"}
                                    </Typography.Paragraph>
                                    <Button
                                        type="primary"
                                        size="small"
                                        onClick={() => router.push(`/courses/${course.id}`)}
                                    >
                                        Подробнее
                                    </Button>
                                </div>
                            </Collapse.Panel>
                        </Collapse>
                    </List.Item>
                )}
            />
        );
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Spin size="large" /></div>;
    }

    return (
        <div className="bg-white p-5 shadow-lg rounded-lg relative">
            <div className="absolute top-5 right-5 flex space-x-3">
                <Button type="primary" danger onClick={handleBlockUser}>
                    Заблокировать
                </Button>
            </div>
            
            <Breadcrumb items={[
                { title: <Link href="/control-panel/users">Пользователи</Link> },
                { title: `${user?.second_name} ${user?.first_name} ${user?.last_name}` || "Пользователь" },
            ]} />
            <Title level={2} className="text-center my-5">Информация о пользователе</Title>

            <Card>
                <div className="flex items-center">
                    <div className="mr-4">
                        <Avatar
                            size={180}
                            src={user?.profile_url ? `${nextConfig.env?.API_URL}${user.profile_url}` : ""}
                            icon={<UserOutlined />}
                            className="border border-gray-300"
                        />
                    </div>
                    <Descriptions column={2} bordered>
                        <Descriptions.Item label="Фамилия">{user?.second_name || "Не указано"}</Descriptions.Item>
                        <Descriptions.Item label="Имя">{user?.first_name || "Не указано"}</Descriptions.Item>
                        <Descriptions.Item label="Отчество">{user?.last_name || "Не указано"}</Descriptions.Item>
                        <Descriptions.Item label="Дата рождения">
                            {user?.birth_day ? new Date(user.birth_day).toLocaleDateString() : "Не указано"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Электронная почта">{user?.email || "Не указано"}</Descriptions.Item>
                        <Descriptions.Item label="Телефон">{user?.phone || "Не указано"}</Descriptions.Item>
                    </Descriptions>
                </div>
            </Card>

            <Divider />

            <Card>
                <Descriptions title="Дополнительная информация" bordered>
                    <Descriptions.Item label="Город">{user?.city || "Не указано"}</Descriptions.Item>
                    <Descriptions.Item label="Роль и статус">{renderTag(user?.role, user?.status)}</Descriptions.Item>
                    <Descriptions.Item label="Дата регистрации">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Не указано"}
                    </Descriptions.Item>
                </Descriptions>
                <Divider />
                <div>
                    <Title level={4}>Обо мне</Title>
                    <div className="bg-gray-50 p-4 rounded-md shadow-inner border">
                        <Text>{user?.about_me || "Нет информации"}</Text>
                    </div>
                </div>
            </Card>

            <Divider />

            {user?.role === "teacher" && (
                <Card>
                    <Title level={4}>Курсы, созданные преподавателем</Title>
                    {renderCourses(user?.courses, true)}
                </Card>
            )}

            {user?.role === "student" && (
                <Card>
                    <Title level={4}>Курсы, на которые подписан пользователь</Title>
                    {renderCourses(user?.courses, false)}
                </Card>
            )}
        </div>
    );
};

export default observer(UserDetailsPage);
