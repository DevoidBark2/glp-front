"use client"
import { PostList } from "@/entities/post/ui/postList";
import { useMobxStores } from "@/shared/store/RootStore";
import { Divider, Carousel } from "antd";
import { observer } from "mobx-react";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image"
import nextConfig from "next.config.mjs";
import { BookOutlined } from "@ant-design/icons";

export const Posts = observer(() => {
    const { postStore, courseStore } = useMobxStores();

    useEffect(() => {
        postStore.getAllPosts();
        courseStore.getAllCourses(); // Загрузка курсов
    }, []);

    return (
        <div className="container mx-auto">
            <div className="px-6">
                {/* Карусель с курсами */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Популярные курсы</h2>
                    <Carousel autoplay className="rounded-lg overflow-hidden">
                        {courseStore.courses.slice(0, 5).map((course, index) => (
                            <div key={course.id || index} className="flex justify-center items-center p-4">
                                <div className="bg-white rounded-lg shadow-lg p-6 flex items-center max-w-md">
                                    {/* Картинка курса */}
                                    <div className="flex-shrink-0 w-32 h-32 mr-4 bg-gray-200 rounded-lg overflow-hidden">
                                        {course.image ? (
                                            <Image
                                                src={`${nextConfig.env!.API_URL}${course.image}`}
                                                alt={course.name}
                                                width={0}
                                                height={0}
                                                sizes="100vw"
                                                style={{ width: '100%', height: '100%' }}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                <BookOutlined style={{ fontSize: '48px', color: '#8c8c8c' }} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Контент курса */}
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-800">{course.name}</h3>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {course.small_description?.length > 100
                                                ? `${course.small_description.slice(0, 100)}...`
                                                : course.small_description || 'Описание курса'}
                                        </p>
                                        <Link
                                            href={`/platform/courses/${course.id}`}
                                            className="text-blue-500 mt-4 inline-block hover:underline"
                                        >
                                            Подробнее
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>



                {/* Заголовок и новости */}
                <h1 className="mt-6 text-3xl font-semibold text-gray-800 mb-6">Новости</h1>
                <Divider className="my-6" />
                <PostList loading={postStore.loading} posts={postStore.allPosts} />
            </div>
        </div>
    );
});
