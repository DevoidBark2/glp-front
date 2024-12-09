"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Breadcrumb, Button, Divider, notification, Rate, Spin } from "antd";
import { useParams } from "next/navigation";
import { useMobxStores } from "@/stores/stores";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CourseLevelComponent from "@/components/CourseLevelComponent/CourseLevelComponent";
import nextConfig from "next.config.mjs";
import { Course } from "@/shared/api/course/model";
import {ClockCircleOutlined,BarsOutlined} from "@ant-design/icons";
import { getCookieUserDetails } from "@/lib/users";

const CoursePage = () => {
    const { courseId } = useParams();
    const router = useRouter();
    const { courseStore, userStore } = useMobxStores();
    const [currentCourse,setCurrentCourse] = useState<Course | null>(null);

    const handleClick = () => {
        const user = getCookieUserDetails();

        if(!user) {
            userStore.setOpenLoginModal(true);
            return;
        }
        () => router.push(`/platform/lessons/${courseId}`)
    }

    useEffect(() => {
        courseStore.getCourseDetailsById(Number(courseId)).then(response => {
            setCurrentCourse(response);
        }).catch((e) => {
            router.push("/platform/courses");
            notification.error({ message: e.response.data.message });
        });
    }, [courseId]);
 

    return (
        <div className="container mx-auto">
            <div className="px-6">
                <div className="mt-4">
                    <Breadcrumb
                        items={[
                            { title: <Link href="/platform/courses">Курсы</Link> },
                            { title: <p>{currentCourse?.name}</p> },
                        ]}
                    />
                </div>

                {currentCourse && <div className="flex justify-end my-4">
                            <Button
                                type="primary"
                                size="large"
                                className="px-12 py-2 rounded-lg font-medium"
                                onClick={handleClick}
                            >
                                {currentCourse.isUserEnrolled ? "Перейти к курсу" : "Записаться на курс"}
                            </Button>
                        </div>}

                {currentCourse ? (
                    <>
                        <div className="bg-white shadow-md rounded-lg p-6 mt-6 flex flex-col lg:flex-row items-start lg:items-center">
                            <div className="lg:w-3/4">
                                <h1 className="font-bold text-4xl text-gray-800">
                                    {currentCourse.name}
                                </h1>
                                <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                                    {currentCourse.small_description}
                                </p>
                            </div>
                            <div className="w-full lg:w-1/4 lg:ml-6 mt-6 lg:mt-0 flex justify-center">
                                <img
                                    src={`${nextConfig.env?.API_URL}${currentCourse.image}`}
                                    alt="Course Image"
                                    className="rounded-lg shadow-lg object-cover"
                                    width={200}
                                    height={200}
                                />
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="flex items-center bg-gray-100 p-4 rounded-lg">
                                <CourseLevelComponent level={currentCourse.level} />
                            </div>
                            <div className="flex items-center bg-gray-100 p-4 rounded-lg">
                                <ClockCircleOutlined style={{fontSize:30}}/>
                                <span className="ml-4 text-gray-700 text-base font-medium">
                                    Продолжительность: {currentCourse.duration} ч.
                                </span>
                            </div>
                            <div className="flex items-center bg-gray-100 p-4 rounded-lg">
                                <BarsOutlined style={{fontSize: 30}}/>
                                <span className="ml-4 text-gray-700 text-base font-medium">
                                    Категория: {currentCourse.category?.name}
                                </span>
                            </div>
                        </div>

                        <Divider />
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Описание курса
                        </h2>
                        <div
                            className="text-gray-600 leading-relaxed bg-white p-6 rounded-lg shadow-md"
                            dangerouslySetInnerHTML={{
                                __html: currentCourse.content_description,
                            }}
                        ></div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <Spin size="large" />
                        <p className="text-gray-500 mt-4">Загрузка информации о курсе...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default observer(CoursePage);