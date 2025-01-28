"use client"
import { Button, Empty } from "antd";
import { CourseProfileItem } from "../CourseProfileItem";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react";
import { useMobxStores } from "@/shared/store/RootStore";

export const CourseProfileList = observer(() => {
    const { userProfileStore } = useMobxStores();
    const router = useRouter();
    return (
        <>
            {userProfileStore.userProfileCourses.length > 0 ? userProfileStore.userProfileCourses.map(course => (
                <CourseProfileItem key={course.id} course={course} />
            )) : <div className="flex items-center justify-center h-3/4">
                <Empty description={<div className="flex flex-col">
                    <span>Список пуст</span>
                    <Button type="primary" className="mt-2" onClick={() => router.push('/platform/')}>Перейти к списку</Button>
                </div>} />
            </div>}
        </>
    )
})