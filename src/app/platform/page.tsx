"use client"
import React, { useEffect, useState } from "react";
import { Avatar, Button, Divider, Input, Skeleton } from "antd";
import nextConfig from "../../../next.config.mjs";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { CourseList, CourseCarousel } from "@/entities/course/ui";
import { useRouter } from 'next/navigation';
import { useMobxStores } from '@/shared/store/RootStore';
import { AuthMethodEnum } from '@/shared/api/auth/model';
import Link from 'next/link';
import { observer } from "mobx-react";

const PlatformPage = () => {
    const { courseStore, nomenclatureStore } = useMobxStores()
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number>(-1);
    const [noResultsFound, setNoResultsFound] = useState(false);
    const router = useRouter()

    const handleSearch = () => {
        router.push(`platform/courses?search=${encodeURIComponent(searchTerm.trim())}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
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
        courseStore.getAllCourses();
        // courseStore.getAllPopularCourses();
        // nomenclatureStore.getCategories();
        // nomenclatureStore.getTeachers();
    }, []);

    return <div className="container mx-auto max-lg:px-4 px-2">

        <div className="flex justify-end">
            <div className="flex items-center w-1/2">
                <div className="relative w-full">
                    <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input
                        placeholder="Название курса, автор..."
                        allowClear
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-gray-500 transition w-full"
                    />
                </div>

                <Button
                    color="default" variant="solid"
                    className="ml-5"
                    icon={<SearchOutlined />}
                    onClick={handleSearch}
                >
                    Искать
                </Button>
            </div>
        </div>


        {/* <CourseCarousel /> */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 mt-6">


            <h1 className="text-3xl font-semibold text-gray-800 md:w-9/12 w-full text-center md:text-left dark:text-white">
                Доступные курсы
            </h1>


        </div>

        <Divider className="my-6" />

        {/* <div className="flex flex-wrap gap-4 mb-6">
            {!nomenclatureStore.loadingCategories && nomenclatureStore.categories.length < 1 ? (
                Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton.Input key={index} active />
                ))
            ) : (
                nomenclatureStore.categories.length > 0 && (
                    <>
                        <button
                            key="all-categories"
                            onClick={() => handleFilterCoursesByCategory(-1)}
                            className={`px-4 py-2 text-sm font-medium shadow-sm cursor-pointer rounded-lg ${selectedCategory === -1
                                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                : "bg-transparent text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Все категории
                        </button>
                        {nomenclatureStore.categories.map((it) => (
                            <button
                                key={it.id}
                                onClick={() => handleFilterCoursesByCategory(it.id)}
                                className={`px-4 py-2 text-sm font-medium shadow-sm cursor-pointer rounded-lg ${selectedCategory === it.id
                                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {it.name}
                            </button>
                        ))}
                    </>
                )
            )}
        </div> */}

        {noResultsFound && (
            <div className="text-center py-10">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Курсы не найдены</h3>
                <p className="text-gray-600">Извините, по вашему запросу курсы не найдены. Пожалуйста, попробуйте другой
                    запрос.</p>
            </div>
        )}

        <CourseList courses={courseStore.courses} loading={courseStore.loadingCourses} notFound={noResultsFound} />

        {/* <div className="container mx-auto my-12">
            <h1 className="text-3xl font-semibold text-gray-800 md:w-9/12 w-full text-center md:text-left dark:text-white">
                Наши преподаватели
            </h1>
            <Divider />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {nomenclatureStore.teachers.map((teacher) => (
                    <div key={teacher.id} className="bg-white dark:bg-[#252525] shadow-lg rounded-lg p-6 text-center">
                        <Avatar
                            size={130}
                            src={
                                teacher?.profile_url
                                    ? teacher?.method_auth === AuthMethodEnum.GOOGLE ||
                                        teacher?.method_auth === AuthMethodEnum.YANDEX
                                        ? teacher?.profile_url
                                        : `${nextConfig.env?.API_URL}${teacher?.profile_url}`
                                    : undefined
                            }
                            icon={!teacher?.profile_url && <UserOutlined />}
                        />
                        <Link href={`/platform/users/${teacher.id}`} className='hover:underline hover:cursor-pointer'>
                            <h3 className="text-xl font-semibold text-gray-800 mt-4 dark:text-white">{`${teacher.second_name ?? ''} ${teacher.first_name ?? ''} ${teacher.last_name ?? ''}`}</h3>
                        </Link>
                        <p className="text-gray-600 mt-4 dark:text-white">{teacher.about_me ?? ''}</p>
                    </div>
                ))}
            </div>
        </div> */}
    </div >
}

export default observer(PlatformPage);