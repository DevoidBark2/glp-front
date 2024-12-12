import { FORMAT_VIEW_DATE, MAIN_COLOR } from "@/constants"
import { Course } from "@/shared/api/course/model"
import { useMobxStores } from "@/stores/stores"
import { Button, Popconfirm, Progress, Tooltip } from "antd"
import dayjs from "dayjs"
import nextConfig from "next.config.mjs"
import { useRouter } from "next/navigation"
import { FC } from "react"
import Image from "next/image";
import {BookOutlined} from "@ant-design/icons";

interface CourseProfileItemProps {
    course: Course
}

export const CourseProfileItem: FC<CourseProfileItemProps> = ({course} ) => {
    const { userProfileStore } = useMobxStores();
    const router = useRouter();

    return (
        <div key={course.courseId} className="p-4 bg-gray-50 mt-4 rounded-md shadow-md">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    {
                        course.image ?
                            <Image src={`${nextConfig.env!.API_URL}${course?.image}`} alt={course.name} width={100}
                                   height={60} className="mr-4"/>
                            : <div
                                style={{
                                    width: 100,
                                    height: 60,
                                    borderRadius: 4,
                                }}
                                className="mr-4 flex items-center justify-center bg-[#f0f0f0]"
                            >
                                <BookOutlined style={{fontSize: 30, color: '#8c8c8c'}}/>
                            </div>
                    }
                    <div>
                        <h3 className="text-xl font-semibold">{course.name}</h3>
                        <p className="text-gray-600">Дата
                            записи: {dayjs(course.enrolledAt).format(FORMAT_VIEW_DATE)}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <Tooltip title={`Перейти к курсу "${course.name}"`}>
                        <Button type="primary" onClick={() => {
                            router.push(`/platform/lessons/${course.courseId}`)
                        }}>Продолжить</Button>
                    </Tooltip>
                    <Popconfirm
                        title="Это действие нельзя отменить. Все сохранные данные будут удалены, Вы согласны?"
                        onConfirm={() => userProfileStore.confirmLeaveCourse(course.courseId)}
                        placement="leftBottom"
                        okText="Да"
                        cancelText="Нет"
                        >
                        <Button danger className="ml-2">
                            Покинуть курс
                        </Button>
                    </Popconfirm>
                </div>
            </div>
            <Progress percent={course.progress} strokeColor={MAIN_COLOR} />
        </div>
    )
}