"use client";
import { observer } from "mobx-react";
import { useMobxStores } from "@/stores/stores";
import React, { useEffect, useState } from "react";
import { Divider, Spin, Input, Button } from "antd";
import { CourseList } from "@/entities/course/ui";
import { EmptyContent } from "@/shared/ui/emptyContent";
import { FilterOutlined } from "@ant-design/icons";

const CoursesPage = () => {
    const { courseStore, nomenclatureStore } = useMobxStores();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        courseStore.getAllCourses();
        nomenclatureStore.getCategories();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        //courseStore.filterCoursesBySearch(e.target.value); // Предполагаем, что метод фильтрации есть
    };

    const openFilters = () => {
        // Реализуйте логику открытия модального окна с фильтрами
        console.log("Открытие модального окна для фильтров");
    };

    return (
        <div className="container mx-auto py-6">
            {/* Заголовок с поиском и кнопкой для фильтров */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <h1 className="text-3xl font-semibold text-gray-800 md:w-9/12 w-full text-center md:text-left">
                    Доступные курсы
                </h1>
                <Input
                    placeholder="Поиск курсов..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="md:w-3/12"
                />
            </div>



            <Divider className="my-6" />

            {/* Список категорий */}
            <div className="flex flex-wrap gap-4 mb-6">
                {/* "Все категории" */}
                <div
                    key="all-categories"
                    // onClick={() => courseStore.resetFilters()}
                    className="px-4 py-2 bg-blue-100 rounded-lg text-sm font-medium text-blue-700 shadow-sm hover:bg-blue-200 cursor-pointer"
                >
                    Все категории
                </div>

                {nomenclatureStore.categories.map((it) => (
                    <div
                        key={it.id}
                        className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 cursor-pointer"
                    >
                        {it.name}
                    </div>
                ))}
            </div>

            {/* Список курсов */}
            {!courseStore.loadingCourses ? (
                courseStore.courses.length > 0 ? (
                    <CourseList courses={courseStore.courses} />
                ) : (
                    <EmptyContent
                        image="/static/empty-icon.svg"
                        title="Курсы не найдены"
                        description="Не переживайте, контент скоро появится. Пожалуйста, вернитесь позже!"
                    />
                )
            ) : (
                <div className="flex justify-center items-center h-60">
                    <Spin size="large" />
                </div>
            )}
        </div>
    );
};

export default observer(CoursesPage);
