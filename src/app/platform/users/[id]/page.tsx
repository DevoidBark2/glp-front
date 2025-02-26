"use client";
import { User } from "@/shared/api/user/model";
import { useMobxStores } from "@/shared/store/RootStore";
import { observer } from "mobx-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton, Card, Divider, Row, Col, Avatar } from "antd";
import { AppstoreAddOutlined, CalendarOutlined, UserOutlined } from "@ant-design/icons";
import nextConfig from "next.config.mjs";
import { AuthMethodEnum } from "@/shared/api/auth/model";
import { CourseList } from "@/entities/course/ui";

const UserPage = observer(() => {
    const { id } = useParams();
    const { userStore, courseStore } = useMobxStores();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        userStore.getUserById(String(id)).then(response => {
            setCurrentUser(response);
            setLoading(false);
        });
    }, [id]);

    return (
        <div className="container mx-auto p-6">
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={8} md={6} lg={6} className="flex flex-col items-center mb-6">
                    {loading ? (
                        <Skeleton.Avatar active size={250} />
                    ) : (
                        <div
                            className="frame frame-diamond"
                        >
                            <Avatar
                                shape="square"
                                size={250}
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
                    )}

                    <div className="mt-4 text-left w-full">
                        {loading ? (
                            <Skeleton paragraph={{ rows: 2 }} active />
                        ) : (
                            <div className="flex flex-col items-start">
                                <div className="flex items-center space-x-2">
                                    <AppstoreAddOutlined className="text-xl text-blue-500" />
                                    <p className="text-lg font-semibold text-gray-800">
                                        {currentUser?.courses.length} {currentUser?.courses.length === 1 ? "курс" : "курсов"}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                    <CalendarOutlined className="text-lg text-gray-500" />
                                    <p className="text-sm text-gray-500">
                                        Зарегистрирован: {new Date(currentUser!.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                </Col>

                <Col xs={24} sm={16} md={18} lg={18}>
                    {loading ? (
                        <Skeleton title={true} paragraph={{ rows: 1 }} active />
                    ) : (
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {`${currentUser?.second_name ?? ""} ${currentUser?.first_name ?? ""} ${currentUser?.last_name ?? ""}`.trim()}
                            </h2>
                        </div>
                    )}

                    <Divider />

                    <Card title="О себе" variant="outlined" className="mt-4">
                        {loading ? (
                            <Skeleton paragraph={{ rows: 3 }} active />
                        ) : (
                            <p className="text-gray-700">
                                {currentUser?.about_me || "Пользователь не заполнил информацию о себе."}
                            </p>
                        )}
                    </Card>

                    <Divider />

                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Курсы, которые преподает
                        </h3>
                        {loading ? (
                            <Skeleton paragraph={{ rows: 2 }} active />
                        ) : currentUser?.courses.length === 0 ? (
                            <p>У этого пользователя нет курсов.</p>
                        ) : (
                            <CourseList
                                courses={currentUser!.courses}
                                loading={courseStore.loadingCourses}
                                notFound={false}
                            />
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
});

export default UserPage;
