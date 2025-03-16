"use client"
import React, { useEffect, useState } from "react";
import { Button, Divider, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from 'next/navigation';
import { observer } from "mobx-react";
import { useTheme } from "next-themes";

import { useMobxStores } from '@/shared/store/RootStore';
import { CourseList } from "@/entities/course/ui";

const PlatformPage = () => {
    const { courseStore } = useMobxStores()
    const [searchTerm, setSearchTerm] = useState("");
    const [noResultsFound, setNoResultsFound] = useState(false);
    const router = useRouter()
    const { resolvedTheme } = useTheme()

    const handleSearch = () => {
        router.push(`platform/courses?search=${encodeURIComponent(searchTerm.trim())}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    useEffect(() => {
        if (searchTerm.length > 2 && courseStore.courses.length === 0) {
            setNoResultsFound(true);
        } else {
            setNoResultsFound(false);
        }
    }, [courseStore.courses, searchTerm]);



    useEffect(() => {
        courseStore.getAllCourses();
    }, []);

    return <div className="container mx-auto max-lg:px-4 px-2">

        {/*<div className="flex justify-end">*/}
        {/*    <div className="flex items-center  w-full lg:w-1/2">*/}
        {/*        <div className="relative w-full">*/}
        {/*            <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />*/}
        {/*            <Input*/}
        {/*                placeholder="Название курса, автор..."*/}
        {/*                allowClear*/}
        {/*                value={searchTerm}*/}
        {/*                onChange={(e) => setSearchTerm(e.target.value)}*/}
        {/*                onKeyDown={handleKeyDown}*/}
        {/*                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-gray-500 transition w-full"*/}
        {/*            />*/}
        {/*        </div>*/}

        {/*        <Button*/}
        {/*            variant={resolvedTheme && resolvedTheme === "dark" ? "outlined" : "solid"}*/}
        {/*            className="ml-5"*/}
        {/*            icon={<SearchOutlined />}*/}
        {/*            onClick={handleSearch}*/}
        {/*        >*/}
        {/*            Искать*/}
        {/*        </Button>*/}
        {/*    </div>*/}
        {/*</div>*/}

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 mt-6">
            <h1 className="text-3xl font-semibold text-gray-800 md:w-9/12 w-full text-center md:text-left dark:text-white">
                Доступные курсы
            </h1>
        </div>

        <Divider className="my-6" />

        {noResultsFound && (
            <div className="text-center py-10">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Курсы не найдены</h3>
                <p className="text-gray-600">Извините, по вашему запросу курсы не найдены. Пожалуйста, попробуйте другой
                    запрос.</p>
            </div>
        )}

        <CourseList courses={courseStore.courses} loading={courseStore.loadingCourses} notFound={noResultsFound} />
    </div >
}

export default observer(PlatformPage);