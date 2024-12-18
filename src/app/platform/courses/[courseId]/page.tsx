"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Breadcrumb, Button, Divider, notification, Spin } from "antd";
import { useParams } from "next/navigation";
import { useMobxStores } from "@/stores/stores";
import { useRouter } from "next/navigation";
import Link from "next/link";
import nextConfig from "next.config.mjs";
import { Course } from "@/shared/api/course/model";
import {ClockCircleOutlined, BarsOutlined, BookOutlined} from "@ant-design/icons";
import { getCookieUserDetails } from "@/lib/users";
import Image from "next/image";
import {CourseLevelComponent} from "@/entities/course/ui";

const CoursePage = () => {
    const { courseStore, userStore } = useMobxStores();
    const [currentCourse,setCurrentCourse] = useState<Course | null>(null);
    const { courseId } = useParams();
    const router = useRouter();

    const handleClick = () => {
        courseStore.setSubscribeCourseLoading(true);
        const user = getCookieUserDetails();

        if(!user) {
            userStore.setOpenLoginModal(true);
            courseStore.setSubscribeCourseLoading(false);
            return;
        }

        if(currentCourse && currentCourse.isUserEnrolled) {
            router.push(`/platform/lessons/${courseId}`)
            courseStore.setSubscribeCourseLoading(false);
            return;
        }

        courseStore.subscribeCourse(Number(courseId),user.user.id).then(response => {
            router.push(`/platform/lessons/${courseId}`)
        }).finally(() => {
            courseStore.setSubscribeCourseLoading(false);
        })
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
                                loading={courseStore.subscribeCourseLoading}
                                onClick={handleClick}
                                disabled={courseStore.subscribeCourseLoading}
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
                                {currentCourse.image ? (
                                    <Image
                                        src={`${nextConfig.env!.API_URL}${currentCourse.image}`}
                                        alt={currentCourse.name}
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        style={{width: '100%', height: 'auto'}}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-80 h-48 flex items-center justify-center bg-gray-200">
                                        <BookOutlined style={{fontSize: '48px', color: '#8c8c8c'}}/>
                                    </div>
                                )}
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