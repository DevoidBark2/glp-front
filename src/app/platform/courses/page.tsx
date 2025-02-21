"use client"
import { Button, Breadcrumb, Input, Divider, Empty } from "antd";
import {ArrowLeftOutlined, SearchOutlined} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { CourseList } from "@/entities/course/ui";
import { observer } from "mobx-react";
import { useMobxStores } from "@/shared/store/RootStore";
import FilterBlock from "@/entities/filters/ui/FilterBlock";
import {useRouter} from "next/navigation";

const CoursesSearch = observer(() => {
    const { courseStore, nomenclatureStore } = useMobxStores();
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        courseStore.handleFilterCoursesBySearch(searchTerm)
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchTerm.trim().length >= 4) {
            handleSearch();
        }
    };

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const searchQuery = query.get('search');

        if (searchQuery) {
            setSearchTerm(searchQuery);
            courseStore.handleFilterCoursesBySearch(searchQuery)
        }

    }, []);

    useEffect(() => {
        nomenclatureStore.getCategories();
    }, [])

    return (
        <div className="container mx-auto px-4">
            <Breadcrumb
                items={[
                    {
                        title: <Button icon={<ArrowLeftOutlined />} color="default" type="link" variant="link"
                                       onClick={() => router.push("/platform")}
                        >Главная</Button>
                    },
                ]}
            />
            <Divider />

            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-6">Результаты поиска</h1>
                <Input.Search
                    placeholder="Название курса, автор..."
                    allowClear
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    prefix={<SearchOutlined className="text-gray-500" />}
                    enterButton={
                        <Button
                            disabled={searchTerm.trim().length < 4}
                            type="default"
                            className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 ml-2"
                            icon={<SearchOutlined />}
                            onClick={handleSearch}
                        >
                            Искать
                        </Button>
                    }
                    className="w-full md:w-2/3 mb-4"
                />
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Фильтры на мобильных устройствах будут сверху */}
                <div className="w-full md:w-1/4">
                    <FilterBlock />
                </div>

                <div className="flex-1">
                    {courseStore.resultSearchCourses.length > 0 ? (
                        <CourseList
                            courses={courseStore.resultSearchCourses}
                            loading={courseStore.loadingCourses}
                            notFound={true}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-16">
                            <Empty description=" К сожалению, курсы по вашему запросу не найдены." />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default CoursesSearch;
