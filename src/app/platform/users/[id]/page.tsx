"use client";
import { observer } from "mobx-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Skeleton, Card, Divider, Row, Col } from "antd";
import { AppstoreAddOutlined, CalendarOutlined } from "@ant-design/icons";

import { useMobxStores } from "@/shared/store/RootStore";
import { User } from "@/shared/api/user/model";
import { CourseList } from "@/entities/course/ui";
import {UserAvatar} from "@/entities/user-profile";

const UserPage = observer(() => {
    const { id } = useParams();
    const { userStore, courseStore } = useMobxStores();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        userStore.getPlatformUserById(String(id)).then(response => {
            setCurrentUser(response);
            setLoading(false);
        });
    }, [id, userStore]);

    return (
        <div className="container mx-auto p-6">
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} lg={8} xl={6} className="flex flex-col items-center mb-6">
                    {loading ? (
                        <Skeleton.Avatar active size={250} />
                    ) : (
                        <div
                            className={
                                currentUser?.activeCustomization?.frame
                                    ? `frame ${currentUser?.activeCustomization.frame.className}`
                                    : ''
                            }
                        >
                            <UserAvatar currentUser={currentUser} size={250} />
                        </div>
                    )}

                    <div className="mt-4 text-left w-full">
                        {loading ? (
                            <Skeleton paragraph={{ rows: 2 }} active />
                        ) : (
                            <div className="flex flex-col items-start">
                                <div className="flex items-center space-x-2">
                                    <AppstoreAddOutlined className="text-xl text-blue-500" />
                                    <p className="text-sm text-gray-500">
                                        Курсов: {currentUser?.courses.length}
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

                <Col xs={24} sm={24} md={12} lg={16} xl={18}>
                    {loading ? (
                        <Skeleton title={true} paragraph={{ rows: 1 }} active />
                    ) : (
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {`${currentUser?.second_name ?? ''} ${currentUser?.first_name ?? ''} ${currentUser?.last_name ?? ''}`.trim()}
                            </h2>
                        </div>
                    )}

                    <Divider />

                    <Card title="О себе" variant="outlined" className="mt-4">
                        {loading ? (
                            <Skeleton paragraph={{ rows: 3 }} active />
                        ) : (
                            <p className="text-gray-700">
                                {currentUser?.about_me || 'Пользователь не заполнил информацию о себе.'}
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
