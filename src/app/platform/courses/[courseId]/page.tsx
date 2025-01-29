"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Avatar, Breadcrumb, Button, Divider, List, notification, Rate, Spin } from "antd";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import nextConfig from "next.config.mjs";
import { AccessRightEnum, Course } from "@/shared/api/course/model";
import { ClockCircleOutlined, BarsOutlined, BookOutlined, UnlockOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import Image from "next/image";
import { CourseLevelComponent, InputSecretKeyModal } from "@/entities/course/ui";
import { useMobxStores } from "@/shared/store/RootStore";
import { AuthMethodEnum } from "@/shared/api/auth/model";

const CoursePage = () => {
    const { courseStore, userProfileStore } = useMobxStores();
    const { courseId } = useParams();
    const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
    const [inputSecretKeyModal, setInputSecretKeyModal] = useState(false);
    const router = useRouter();

    const mockReviews = [
        {
            id: 1,
            user: {
                first_name: "Иван",
                last_name: "Петров",
                profile_url: "",
            },
            rating: 5,
            comment: "Отличный курс! Всё понятно и интересно объяснено.",
        },
        {
            id: 2,
            user: {
                first_name: "Мария",
                last_name: "Сидорова",
                profile_url: "",
            },
            rating: 4,
            comment: "Хороший курс, но хотелось бы больше примеров.",
        },
        {
            id: 3,
            user: {
                first_name: "Алексей",
                last_name: "Кузнецов",
                profile_url: "",
            },
            rating: 3.5,
            comment: "Неплохо, но есть где улучшить подачу материала.",
        },
    ];

    const averageRating = mockReviews.length
        ? mockReviews.reduce((acc, review) => acc + review.rating, 0) / mockReviews.length
        : 0;

    const handleClick = () => {
        if (currentCourse?.access_right === AccessRightEnum.PRIVATE) {
            setInputSecretKeyModal(true)
        }
        courseStore.setSubscribeCourseLoading(true);

        if (!userProfileStore.userProfile) {
            router.push('/platform/auth/login')
            courseStore.setSubscribeCourseLoading(false);
            return;
        }

        if (currentCourse && currentCourse.isUserEnrolled) {
            router.push(`/platform/lessons/${courseId}`)
            courseStore.setSubscribeCourseLoading(false);
            return;
        }

        courseStore.subscribeCourse(Number(courseId), userProfileStore.userProfile?.id).then(response => {
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
        <>
            {inputSecretKeyModal && <InputSecretKeyModal inputSecretKeyModal={inputSecretKeyModal} setInputSecretKeyModal={setInputSecretKeyModal} />}
            <div className="container mx-auto">
                <div className="px-6">
                    <div className="mt-4">
                        <Breadcrumb
                            items={[
                                { title: <Link href="/platform">Главная</Link> },
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
                            <div
                                className="bg-white shadow-md rounded-lg p-6 mt-6 flex flex-col lg:flex-row items-start lg:items-center">
                                <div className="lg:w-3/4">
                                    <h1 className="font-bold text-4xl text-gray-800 flex items-center">
                                        {currentCourse.name}
                                        <Image
                                            src="/static/certificate_icon.svg"
                                            alt="Certificate"
                                            width={40}
                                            height={40}
                                            className="ml-3"
                                        />
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
                                            style={{ width: '100%', height: 'auto' }}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-80 h-48 flex items-center justify-center bg-gray-200">
                                            <BookOutlined style={{ fontSize: '48px', color: '#8c8c8c' }} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div
                                className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                                <div className="flex items-center bg-gray-100 p-4 rounded-lg">
                                    <CourseLevelComponent level={currentCourse.level} />
                                </div>
                                <div className="flex items-center bg-gray-100 p-4 rounded-lg">
                                    {currentCourse.access_right === 0 ? (
                                        <>
                                            <UnlockOutlined style={{ fontSize: 30, color: 'green' }} />
                                            <span className="ml-4 text-gray-700 text-base font-medium">
                                                Уровень допуска: <span className="text-green-600 font-semibold">Открытый</span>
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <LockOutlined style={{ fontSize: 30, color: 'red' }} />
                                            <span className="ml-4 text-gray-700 text-base font-medium">
                                                Уровень допуска: <span className="text-red-600 font-semibold">Закрытый</span>
                                            </span>
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center bg-gray-100 p-4 rounded-lg">
                                    <ClockCircleOutlined style={{ fontSize: 30 }} />
                                    <span className="ml-4 text-gray-700 text-base font-medium">
                                        Продолжительность: {currentCourse.duration} ч.
                                    </span>
                                </div>
                                <div className="flex items-center bg-gray-100 p-4 rounded-lg">
                                    <BarsOutlined style={{ fontSize: 30 }} />
                                    <span className="ml-4 text-gray-700 text-base font-medium">
                                        Категория: {currentCourse.category?.name}
                                    </span>
                                </div>
                            </div>

                            <Divider />

                            <div className="">
                                <h3 className="text-xl font-semibold text-gray-800">Преподаватель</h3>

                                <Divider />
                                <div className="flex items-center">
                                    <Avatar
                                        size={80}
                                        src={
                                            currentCourse.user?.profile_url
                                                ? currentCourse.user.method_auth === AuthMethodEnum.GOOGLE ||
                                                    currentCourse.user.method_auth === AuthMethodEnum.YANDEX
                                                    ? currentCourse.user?.profile_url
                                                    : `${nextConfig.env?.API_URL}${currentCourse.user?.profile_url}`
                                                : undefined
                                        }
                                        icon={!currentCourse.user.profile_url && <UserOutlined />}
                                    />
                                    <div className="ml-6">
                                        <Link href={`/platform/users/${currentCourse.user?.id}`} className="hover:underline transition-all">
                                            <p className="text-lg font-medium text-gray-900">
                                                {currentCourse.user?.first_name} {currentCourse.user?.last_name}
                                            </p>
                                        </Link>
                                    </div>
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


                            <div>
                                {/* 🔹 Средний рейтинг курса */}
                                <div className="flex items-center space-x-4 mt-6">
                                    <Rate allowHalf disabled value={averageRating} />
                                    <span className="text-gray-700 text-lg">
                                        {averageRating ? `${averageRating.toFixed(1)} / 5` : "Нет оценок"}
                                    </span>
                                    <span className="text-gray-500 text-sm">({mockReviews.length} отзывов)</span>
                                </div>

                                <Divider />

                                {/* 🔹 Список отзывов */}
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Отзывы пользователей</h2>

                                {mockReviews.length > 0 ? (
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={mockReviews}
                                        renderItem={(review) => (
                                            <List.Item className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
                                                <List.Item.Meta
                                                    avatar={
                                                        <Avatar
                                                            src={review.user.profile_url || undefined}
                                                            icon={!review.user.profile_url && <UserOutlined />}
                                                            size="large"
                                                        />
                                                    }
                                                    title={
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-semibold text-gray-900">
                                                                {review.user.first_name} {review.user.last_name}
                                                            </span>
                                                            <Rate disabled value={review.rating} />
                                                        </div>
                                                    }
                                                    description={<p className="text-gray-700">{review.comment}</p>}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                ) : (
                                    <p className="text-gray-500">Пока нет отзывов.</p>
                                )}
                            </div>
                        </>

                    ) : (
                        <div className="text-center py-20">
                            <Spin size="large" />
                            <p className="text-gray-500 mt-4">Загрузка информации о курсе...</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default observer(CoursePage);