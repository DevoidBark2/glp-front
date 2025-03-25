"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Card, Descriptions, Divider, Tag, Typography, Spin, Button, Avatar, Breadcrumb, Collapse, notification, Modal } from "antd";
import { useParams, useRouter } from "next/navigation";
import { AppstoreOutlined, FileTextOutlined } from "@ant-design/icons";
import Link from "next/link";

import nextConfig from "next.config.mjs";
import { StatusUserEnum, User, UserRole } from "@/shared/api/user/model";
import { PageContainerControlPanel } from "@/shared/ui";
import { Course } from "@/shared/api/course/model";
import { Post } from "@/shared/api/posts/model";
import {showUserStatus} from "@/shared/lib/showUserStatus";
import {useMobxStores} from "@/shared/store/RootStore";
import {UserAvatar} from "@/entities/user-profile";

const { Title, Text } = Typography;



const UserDetailsPage = () => {
    const { userId } = useParams();
    const router = useRouter();
    const { userStore } = useMobxStores();

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

    useEffect(() => {
        if (userId) {
            userStore.getUserById(String(userId))
                .then(setUser)
                .catch((e) => {
                    notification.error({ message: e.response.data.message });
                    router.push('/control-panel/users');
                })
                .finally(() => setLoading(false));
        }
    }, [userId, userStore]);

    const handleConfirmRoleChange = async () => {
        if (!user || !selectedRole) {return;}
        setIsModalOpen(false);

        await userStore.updateUserRole(user.id, selectedRole).then(response => {
            setUser((prev) => (prev ? { ...prev, role: selectedRole } : null));
            notification.success({ message: response.message });
        }).catch(e => {
            notification.error({ message: e.response.data.message });
        })
    };

    const handleCancelRoleChange = () => {
        setIsModalOpen(false);
        setSelectedRole(null);
    };

    const renderModalContent = () => {
        switch (selectedRole) {
            case UserRole.STUDENT:
                return "Вы уверены, что хотите установить роль Пользователь? Это может ограничить доступ к определенным функциям.";
            case UserRole.TEACHER:
                return "Вы уверены, что хотите установить роль Преподаватель? Пользователь получит возможность создавать курсы.";
            case UserRole.MODERATOR:
                return "Вы уверены, что хотите установить роль Модератор? Это даст пользователю доступ к административным функциям.";
            default:
                return "Вы уверены, что хотите изменить роль пользователя?";
        }
    };

    const renderTag = (role: UserRole | undefined, status: StatusUserEnum | undefined) => (
        <>
            <Tag color={role === UserRole.TEACHER ? "blue" : role === UserRole.MODERATOR ? "purple" : "green"}>
                {role === UserRole.TEACHER ? "Преподаватель" : role === UserRole.MODERATOR ? "Модератор" : "Пользователь"}
            </Tag>
            {showUserStatus(status!)}
        </>
    );


    const renderCourses = (courses: Course[]) => {
        if (!courses || courses.length === 0) {
            return <Text type="secondary" className="block text-center">Нет созданных курсов.</Text>;
        }

        const items = courses.map((course) => ({
            key: course.id,
            label: (
                <div className="flex items-center space-x-4">
                    <Avatar
                        src={course.image ? `${nextConfig.env?.API_URL}${course.image}` : ""}
                        size={64}
                        icon={<AppstoreOutlined />}
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
            ),
            children: (
                <div className="p-4 bg-gray-50 rounded-md">
                    <Typography.Paragraph>
                        <strong>Категория:</strong> {course.category?.name || "Не указано"}
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        <strong>Длительность:</strong> {course.duration} часов
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        <strong>Создан:</strong>{" "}
                        {course.created_at ? new Date(course.created_at).toLocaleDateString() : "Не указано"}
                    </Typography.Paragraph>
                    <Button
                        color="blue"
                        variant="solid"
                        size="small"
                        onClick={() => router.push(`/control-panel/courses/${course.id}`)}
                    >
                        Подробнее
                    </Button>
                </div>
            ),
        }));


        return <Collapse items={items} bordered={false} className="w-full" expandIconPosition="end" />;
    };

    const renderPosts = (posts: Post[]) => {
        if (!posts || posts.length === 0) {
            return <Text type="secondary" className="block text-center">Нет созданных постов.</Text>;
        }

        const items = posts.map((post) => ({
            key: post.id,
            label: (
                <div className="flex items-center space-x-4">
                    <Avatar
                        src={post.image ? `${nextConfig.env?.API_URL}${post.image}` : ""}
                        size={64}
                        icon={<FileTextOutlined />}
                        shape="square"
                    />
                    <div>
                        <Typography.Text strong>{post.name}</Typography.Text>
                        <br />
                        <Typography.Text type="secondary" ellipsis>
                            {post.description || "Описание отсутствует"}
                        </Typography.Text>
                    </div>
                </div>
            ),
            children: (
                <div className="p-4 bg-gray-50 rounded-md">
                    <Typography.Paragraph>
                        <strong>Опубликован:</strong>{" "}
                        {post.created_at ? new Date(post.created_at).toLocaleDateString() : "Не указано"}
                    </Typography.Paragraph>
                    <Button
                        color="blue"
                        variant="solid"
                        size="small"
                        onClick={() => router.push(`/control-panel/posts/${post.id}`)}
                    >
                        Подробнее
                    </Button>
                </div>
            ),
        }));

        return <Collapse items={items} bordered={false} className="w-full" expandIconPosition="end" />;
    };

    /* const handleBlockUser = async () => {
         const changeStatus = user?.status === StatusUserEnum.ACTIVATED ? StatusUserEnum.BLOCKED : StatusUserEnum.ACTIVATED
         await userStore.blockUser(user!.id, changeStatus).then(response => {
             setUser((prev) => (prev ? { ...prev, status: changeStatus } : null));
             notification.success({ message: response.message })
         });
     }*/

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Spin size="large" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <PageContainerControlPanel>
            <Modal
                title="Подтверждение изменения роли"
                open={isModalOpen}
                onOk={handleConfirmRoleChange}
                onCancel={handleCancelRoleChange}
                okText="Подтвердить"
                cancelText="Отмена"
            >
                <Typography.Text>{renderModalContent()}</Typography.Text>
            </Modal>

            <Breadcrumb items={[
                { title: <Link href="/control-panel/users">Пользователи</Link> },
                { title: `${user?.second_name || ''} ${user?.first_name || ''} ${user?.last_name || ''}` },
            ]} />
            <Title level={2} className="text-center my-5">Информация о пользователе</Title>

            <Card>
                <div className="flex items-center">
                    <div className="mr-4">
                        <UserAvatar currentUser={user} size={180}/>
                    </div>
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="Фамилия">{user?.second_name || "Не указано"}</Descriptions.Item>
                        <Descriptions.Item label="Имя">{user?.first_name || "Не указано"}</Descriptions.Item>
                        <Descriptions.Item label="Отчество">{user?.last_name || "Не указано"}</Descriptions.Item>
                        <Descriptions.Item label="Электронная почта">{user?.email}</Descriptions.Item>
                        <Descriptions.Item label="Телефон">{user?.phone || "Не указано"}</Descriptions.Item>
                    </Descriptions>
                </div>
            </Card>

            <Divider />

            <Card>
                <Descriptions title="Дополнительная информация" column={1} bordered>
                    <Descriptions.Item label="Роль и статус">
                        <div className="flex items-center space-x-4">
                            {renderTag(user?.role, user?.status)}
                            {/*<Select*/}
                            {/*    value={user?.role}*/}
                            {/*    onChange={showModal}*/}
                            {/*    options={[*/}
                            {/*        { value: UserRole.STUDENT, label: "Пользователь" },*/}
                            {/*        { value: UserRole.TEACHER, label: "Преподаватель" },*/}
                            {/*        { value: UserRole.MODERATOR, label: "Модератор" },*/}
                            {/*    ]}*/}
                            {/*    loading={roleUpdating}*/}
                            {/*    style={{ width: 150 }}*/}
                            {/*/>*/}
                            {/*<div className="flex justify-end">*/}
                            {/*    <Button type="primary" danger={user.status === StatusUserEnum.ACTIVATED} onClick={handleBlockUser}>*/}
                            {/*        {user.status === StatusUserEnum.ACTIVATED ? "Заблокировать" : "Разблокировать"}*/}
                            {/*    </Button>*/}
                            {/*</div>*/}
                        </div>
                    </Descriptions.Item>
                    <Descriptions.Item label="Дата регистрации">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Не указано"}
                    </Descriptions.Item>
                </Descriptions>
                <Divider />
                <div className="mb-3">
                    <Title level={4}>Обо мне</Title>
                    <div className="bg-gray-50 p-4 rounded-md shadow-inner border">
                        <Text>{user?.about_me || "Нет информации"}</Text>
                    </div>
                </div>

                {user?.role === "teacher" && (
                    <div className="mb-3">
                        <Card>
                            <Title level={4}>Курсы, созданные пользователем</Title>
                            {renderCourses(user?.courses)}
                        </Card>
                    </div>
                )}

                {user?.role === "teacher" && (
                    <Card>
                        <Title level={4}>Посты, созданные пользователем</Title>
                        {renderPosts(user?.posts)}
                    </Card>
                )}
            </Card>
        </PageContainerControlPanel>
    );
};

export default observer(UserDetailsPage);
