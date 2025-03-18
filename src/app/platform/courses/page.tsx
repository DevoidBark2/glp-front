"use client"
import { Button, Breadcrumb, Input, Empty } from "antd";
import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { CourseList } from "@/entities/course/ui";
import { useMobxStores } from "@/shared/store/RootStore";
import FilterBlock from "@/entities/filters/ui/FilterBlock";


const CoursesSearch = observer(() => {
    const { courseStore, nomenclatureStore } = useMobxStores();
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();
    const { resolvedTheme } = useTheme()

    const handleSearch = () => {
        courseStore.handleFilterCoursesBySearch(searchTerm)
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchTerm.trim().length >= 3) {
            handleSearch();
        }
    };

    const updateSearchParam = (value: string) => {
        const params = new URLSearchParams(window.location.search);
        if (value) {
            params.set("search", value);
        } else {
            params.delete("search");
        }
        router.push(`?${params.toString()}`, { scroll: false });
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
                        className: "dark:text-white",
                        title: <Button icon={<ArrowLeftOutlined />} color="default" type="link" variant="link"
                            onClick={() => router.push("/platform")}
                            style={{ color: resolvedTheme === "dark" ? "white" : "black" }}
                        >Главная</Button>
                    },
                ]}
            />

            <div className="mb-6">
                <h1 className="text-2xl font-bold my-6">Результаты поиска</h1>
                <div className="flex items-center justify-end">
                    <div className="relative w-full">
                        <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <Input
                            placeholder="Название курса, автор..."
                            allowClear
                            value={searchTerm}
                            onChange={(e) => {
                                updateSearchParam(e.target.value)
                                setSearchTerm(e.target.value)
                            }}
                            onKeyDown={handleKeyDown}
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-gray-500 transition w-full"
                        />
                    </div>

                    <Button
                        color="default" variant={resolvedTheme === "dark" ? "outlined" : "solid"}
                        className="ml-5"
                        icon={<SearchOutlined />}
                        onClick={handleSearch}
                    >
                        Искать
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
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
