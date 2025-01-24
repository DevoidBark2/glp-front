"use client"
import { observer } from 'mobx-react-lite';
import React, {useEffect, useState} from "react";
import {Carousel, Divider, Input, Skeleton} from "antd";
import Image from "next/image";
import nextConfig from "../../../next.config.mjs";
import {BookOutlined, SearchOutlined} from "@ant-design/icons";
import Link from "next/link";
import {useMobxStores} from "@/stores/stores";
import {CourseList} from "@/entities/course/ui";

const PlatformPage = () => {
    const { courseStore, nomenclatureStore } = useMobxStores()
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory,setSelectedCategory] = useState<number>(-1);
    const [noResultsFound, setNoResultsFound] = useState(false);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        if(value.length > 2)
            courseStore.handleFilterCoursesBySearch(value);
    };

    const handleFilterCoursesByCategory = (id: number) => {
        setSelectedCategory(id)
        courseStore.handleFilterCoursesByCategory(id)
    }

    useEffect(() => {
        if (searchTerm.length > 2 && courseStore.courses.length === 0) {
            setNoResultsFound(true);
        } else {
            setNoResultsFound(false);
        }
    }, [courseStore.courses, searchTerm]);

    useEffect(() => {
        courseStore.getAllCourses(); // Загрузка курсов
        nomenclatureStore.getCategories();
    }, []);

    return <div className="container mx-auto">
        <div className="mb-12 mt-12">
            <h2 className="text-3xl font-semibold text-gray-800 md:w-9/12 w-full text-center md:text-left">Популярные
                курсы</h2>
            <Carousel
                autoplay={!courseStore.loadingCourses}
                pauseOnHover={false}
                dots={false}
                speed={1500}
                slidesToShow={4}
                className="rounded-lg overflow-hidden"
                responsive={[
                    {
                        breakpoint: 1024,
                        settings: {slidesToShow: 2},
                    },
                    {
                        breakpoint: 768,
                        settings: {slidesToShow: 1},
                    },
                ]}
            >
                {/* Если данные еще не загружены, показываем скелетоны */}
                {!courseStore.loadingCourses && courseStore.courses.length < 1
                    ? Array.from({length: 4}).map((_, index) => (
                        <div key={index} className="flex justify-center items-center p-4 mb-4">
                            <div className="bg-white rounded-lg shadow-lg p-6 flex items-center max-w-md">
                                {/* Скелетон для картинки */}
                                <div
                                    className="flex-shrink-0 w-32 h-32 mr-4 bg-gray-200 rounded-lg overflow-hidden"></div>

                                {/* Скелетон для текста */}
                                <div className="flex-1">
                                    <Skeleton
                                        active
                                        paragraph={{rows: 2, width: ['80%', '60%']}}
                                        title={{width: '70%'}}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                    : courseStore.courses.slice(0, 5).map((course, index) => (
                        <div key={course.id || index} className="flex justify-center items-center p-4 mb-4">
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
                                            style={{width: '100%', height: '100%'}}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                            <BookOutlined style={{fontSize: '48px', color: '#8c8c8c'}}/>
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

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-semibold text-gray-800 md:w-9/12 w-full text-center md:text-left">
                Доступные курсы
            </h1>
            <Input
                placeholder="Название курса, автор..."
                value={searchTerm}
                allowClear
                onChange={(e) => handleSearch(e.target.value)}
                prefix={<SearchOutlined className="text-gray-500" />}
                className="md:w-3/12"
            />
        </div>

        <Divider className="my-6"/>

        <div className="flex flex-wrap gap-4 mb-6">
            {!nomenclatureStore.loadingCategories && nomenclatureStore.categories.length < 1 ? (
                Array.from({length: 3}).map((_, index) => (
                    <Skeleton.Input key={index} active/>
                ))
            ) : (
                // Отображение реальных данных, если загрузка завершена
                nomenclatureStore.categories.length > 0 && (
                    <>
                        <div
                            key="all-categories"
                            onClick={() => handleFilterCoursesByCategory(-1)}
                            className={`px-4 py-2 text-sm font-medium shadow-sm cursor-pointer rounded-lg ${
                                selectedCategory === -1
                                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                    : "bg-transparent text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Все категории
                        </div>
                        {nomenclatureStore.categories.map((it) => (
                            <div
                                key={it.id}
                                onClick={() => handleFilterCoursesByCategory(it.id)}
                                className={`px-4 py-2 text-sm font-medium shadow-sm cursor-pointer rounded-lg ${
                                    selectedCategory === it.id
                                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {it.name}
                            </div>
                        ))}
                    </>
                )
            )}
        </div>


        {/* Сообщение, если курсы не найдены */}
        {noResultsFound && (
            <div className="text-center py-10">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Курсы не найдены</h3>
                <p className="text-gray-600">Извините, по вашему запросу курсы не найдены. Пожалуйста, попробуйте другой запрос.</p>
            </div>
        )}

        <CourseList courses={courseStore.courses} loading={courseStore.loadingCourses} notFound={noResultsFound}/>
    </div>
}

export default observer(PlatformPage);