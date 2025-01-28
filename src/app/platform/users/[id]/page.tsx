"use client"
import { User } from "@/shared/api/user/model";
import { useMobxStores } from "@/shared/store/RootStore";
import { observer } from "mobx-react"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"
import { Button, Card, Divider, Spin, Tag, Tooltip, Row, Col, Avatar } from "antd";
import { UserOutlined, EditOutlined, PhoneOutlined, MailOutlined, HomeOutlined, CalendarOutlined, AppstoreAddOutlined } from "@ant-design/icons";
import Image from "next/image";
import nextConfig from "next.config.mjs";
import { AuthMethodEnum } from "@/shared/api/auth/model";
import { CourseList } from "@/entities/course/ui";

const UserPage = observer(() => {
    const { id } = useParams();
    const { userStore, courseStore } = useMobxStores();
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        userStore.getUserById(String(id)).then(response => {
            setCurrentUser(response);
        });
    }, [id]);

    if (!currentUser) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            {/* Profile Section: Left Column (Image, Courses count, Registration Date) */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={8} md={6} lg={6} className="flex flex-col items-center mb-6">
                    {/* Аватарка */}
                    <div className="w-32 h-32">
                        <Avatar
                            size={130}
                            src={
                                currentUser?.profile_url
                                    ? currentUser?.method_auth === AuthMethodEnum.GOOGLE ||
                                        currentUser?.method_auth === AuthMethodEnum.YANDEX
                                        ? currentUser?.profile_url
                                        : `${nextConfig.env?.API_URL}${currentUser?.profile_url}`
                                    : undefined
                            }
                            icon={!currentUser?.profile_url && <UserOutlined />}
                        />
                    </div>
                    {/* Контент под аватаркой */}
                    <div className="mt-4 text-left w-full">
                        {/* Количество курсов */}
                        <p className="text-lg font-semibold">
                            <span className="text-gray-800">{currentUser.courses.length}</span> Курсов
                        </p>
                        {/* Дата регистрации */}
                        <p className="text-sm text-gray-500">
                            Зарегистрирован: {new Date(currentUser.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </Col>

                <Col xs={24} sm={16} md={18} lg={18}>

                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {`${currentUser.second_name ?? ''} ${currentUser.first_name ?? ''} ${currentUser.last_name ?? ''}`.trim()}
                        </h2>
                    </div>

                    <Divider />

                    <Card title="О себе" bordered={false} className="mt-4">
                        <p className="text-gray-700">
                            {currentUser.about_me || "Пользователь не заполнил информацию о себе."}
                        </p>
                    </Card>

                    <Divider />



                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Курсы, которые преподает</h3>
                        {currentUser.courses.length === 0 ? (
                            <p>У этого пользователя нет курсов.</p>
                        ) : (
                            <Row gutter={[16, 16]}>
                                <CourseList courses={currentUser.courses} loading={courseStore.loadingCourses} notFound={false} />
                            </Row>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
});

export default UserPage;
