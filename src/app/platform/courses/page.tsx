"use client";
import { observer } from "mobx-react";
import { useMobxStores } from "@/stores/stores";
import React, { useEffect, useState } from "react";
import { Divider, Input, Spin, Tooltip, Button } from "antd";
import CourseDetailsModal from "@/ui/CourseDetailsModal";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import AOS from 'aos';
import 'aos/dist/aos.css';

const CoursesPage = () => {
    const { courseStore } = useMobxStores();
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        courseStore.getAllCourses();
        AOS.init(); // Инициализация AOS для анимаций при прокрутке
    }, []);

    const handleSearch = (e) => {
        setSearchText(e.target.value);
        // courseStore.searchCourses(e.target.value); // Assuming you have a searchCourses function
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Доступные курсы</h1>
                <div className="w-1/4 relative">
                    <Input
                        placeholder="Поиск..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={handleSearch}
                        className="rounded-lg border-gray-300 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>
            <Divider className="my-6" />
            <CourseDetailsModal
                course={courseStore.selectedCourseForDetailModal!}
                openModal={courseStore.openCourseDetailsModal}
                setOpenModal={courseStore.setOpenCourseDetailsModal}
            />
            <div className="flex justify-end mb-4">
                <Button
                    type="default"
                    icon={<ReloadOutlined />}
                    onClick={() => {
                        setSearchText("");
                        courseStore.getAllCourses(); // Reset the course list
                    }}
                >
                    Сбросить фильтры
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {
                    !courseStore.loadingCourses ? courseStore.courses?.map(course => (
                        <div
                            key={course.id}
                            onClick={() => {
                                courseStore.setSelectedCourseForDetailModal(course);
                                courseStore.setOpenCourseDetailsModal(true);
                            }}
                            className="relative flex flex-col justify-between rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer hover:scale-105 transform-gpu"
                            data-aos="fade-down"
                            data-aos-delay="100"
                        >
                            <div className="relative group">
                                <img
                                    src="http://localhost:4200/uploads/Ð¡Ð½Ð¸Ð¼Ð¾Ðº ÑÐºÑÐ°Ð½Ð° Ð¾Ñ 2024-08-01 13-25-49_1724154915044.png"
                                    alt={course.name}
                                    className="w-full h-40 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent rounded-t-lg opacity-40"></div>
                                <div className="absolute bottom-0 left-0 p-4 text-white">
                                    <h3 className="text-lg font-bold">{course.name}</h3>
                                    <p className="text-sm">{course.user.first_name}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white rounded-b-lg flex justify-between items-center">
                                <h4 className="text-md font-semibold text-green-500">Подробнее</h4>
                                <Tooltip title="Посмотреть детали" placement="top">
                                    <Button
                                        type="link"
                                        icon={<SearchOutlined />}
                                        onClick={() => {
                                            courseStore.setSelectedCourseForDetailModal(course);
                                            courseStore.setOpenCourseDetailsModal(true);
                                        }}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                    )) : (
                        <div className="flex justify-center items-center h-60">
                            <Spin size="large" tip="Загрузка курсов..." />
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default observer(CoursesPage);
