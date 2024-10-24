"use client";
import { observer } from "mobx-react";
import { useMobxStores } from "@/stores/stores";
import React, { useEffect, useState } from "react";
import { Divider, Input, Spin, Tooltip, Button, Select, Dropdown } from "antd";
import CourseDetailsModal from "@/ui/CourseDetailsModal";
import { SearchOutlined, ReloadOutlined , DownOutlined,AppstoreOutlined,BarsOutlined} from "@ant-design/icons";
import AOS from 'aos';
import 'aos/dist/aos.css';
import nextConfig from "next.config.mjs";

const CoursesPage = () => {
    const { courseStore } = useMobxStores();
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [viewMode, setViewMode] = useState("list"); // Состояние для вида списка (grid или list)


    useEffect(() => {
        courseStore.getAllCourses();
        AOS.init(); // Инициализация AOS для анимаций при прокрутке
    }, []);

    useEffect(() => {
        AOS.refresh(); // Перезапуск AOS после изменения вида
    }, [viewMode]);

    const handleSearch = (e) => {
        setSearchText(e.target.value);
        // courseStore.searchCourses(e.target.value); // Assuming you have a searchCourses function
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    const applyFilters = () => {
        //courseStore.filterCoursesByCategory(selectedCategory); // Применение фильтров
    };

    const toggleViewMode = (mode) => {
        setViewMode(mode);
    };

    const menu = (
        <div className="p-4 bg-white rounded-lg shadow-lg w-64">
            <h3 className="text-lg font-semibold mb-3">Фильтры</h3>
            <div className="mb-3">
                <span className="block text-sm font-medium text-gray-700 mb-1">Категория</span>
                <Select
                    defaultValue="all"
                    style={{ width: '100%' }}
                    onChange={handleCategoryChange}
                >
                    <Select.Option value="all">Все категории</Select.Option>
                    <Select.Option value="design">Дизайн</Select.Option>
                    <Select.Option value="programming">Программирование</Select.Option>
                    <Select.Option value="marketing">Маркетинг</Select.Option>
                </Select>
            </div>
            <div className="text-right">
                <Button type="primary" onClick={applyFilters}>
                    Применить
                </Button>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto py-6">
            <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
                <h1 className="text-3xl font-semibold text-gray-800">Доступные курсы</h1>
                <Button className="ml-4" icon={<DownOutlined />}>
                    Фильтры 
                </Button>
            </div>
            <div className="flex gap-2 w-2/5 relative">
                <Input
                    placeholder="Поиск..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={handleSearch}
                    className="rounded-lg border-gray-300 focus:border-blue-500 transition-all"
                />
                <Button
                    icon={<AppstoreOutlined />}
                    onClick={() => toggleViewMode("grid")}
                    type={viewMode === "grid" ? "primary" : "default"}
                />
                <Button
                    icon={<BarsOutlined />}
                    onClick={() => toggleViewMode("list")}
                    type={viewMode === "list" ? "primary" : "default"}
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
           {
                !courseStore.loadingCourses ? (
                    viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                            {courseStore.courses?.map(course => (
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
                                            src={`${nextConfig.env!.API_URL}${course.image}`}
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
                            ))}
                        </div>
                    ) : (
                        <div className="mt-6">
                            {courseStore.courses?.map(course => (
                                <div
                                    key={course.id}
                                    onClick={() => {
                                        courseStore.setSelectedCourseForDetailModal(course);
                                        courseStore.setOpenCourseDetailsModal(true);
                                    }}
                                    className="flex justify-between items-center p-4 bg-white rounded-lg shadow-lg mb-4 hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                                    data-aos="fade-down"
                                    data-aos-delay="100"
                                >
                                    <div className="flex items-center">
                                        <img
                                            src={`${nextConfig.env!.API_URL}${course.image}`}
                                            alt={course.name}
                                            className="w-20 h-20 object-cover rounded-lg mr-4"
                                        />
                                        <div>
                                            <h3 className="text-lg font-bold">{course.name}</h3>
                                            <p className="text-sm text-gray-600">{course.user.name}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Button type="link" icon={<SearchOutlined />}>
                                            Подробнее
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    <div className="flex justify-center items-center h-60">
                        <Spin size="large" />
                    </div>
                )
            }
        </div>
    );
}

export default observer(CoursesPage);
