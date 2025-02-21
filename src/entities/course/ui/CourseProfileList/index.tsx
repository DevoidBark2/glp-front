"use client"
import { Button, Divider, Empty } from "antd";
import { CourseProfileItem } from "../CourseProfileItem";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react";
import { useMobxStores } from "@/shared/store/RootStore";
import {useTheme} from "next-themes";

export const CourseProfileList = observer(() => {
    const { userProfileStore } = useMobxStores();
    const router = useRouter();
    const {resolvedTheme} = useTheme()
    return (
        <>
            {userProfileStore.userProfileCourses.length > 0 ? (
                <>
                    <h1 className="text-2xl dark:text-white">Ваши курсы</h1>
                    <Divider style={{borderColor: resolvedTheme === "dark" ? "white" : "dark"}}/>
                    <div className="grid grid-cols-1 gap-4 mt-5">
                        {userProfileStore.userProfileCourses.map((course) => (
                            <CourseProfileItem key={course.id} course={course} />
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-3/4">
                    <Empty
                        description={
                            <div className="flex flex-col text-center text-neon-green">
                                <span>Список пуст</span>
                                <Button
                                    color="default" variant="solid"
                                    className="mt-5"
                                    onClick={() => router.push('/platform/')}>
                                    Перейти к списку
                                </Button>
                            </div>
                        }
                    />
                </div>
            )}
        </>
    )
})