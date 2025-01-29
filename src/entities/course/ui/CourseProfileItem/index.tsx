"use client"
import { Course, CourseReview } from "@/shared/api/course/model"
import { Button, Form, Input, Modal, Popconfirm, Progress, Rate, Tooltip } from "antd"
import dayjs from "dayjs"
import nextConfig from "next.config.mjs"
import { useRouter } from "next/navigation"
import { FC, useState } from "react"
import Image from "next/image";
import { BookOutlined } from "@ant-design/icons";
import { FORMAT_VIEW_DATE, MAIN_COLOR } from "@/shared/constants"
import { useMobxStores } from "@/shared/store/RootStore"

interface CourseProfileItemProps {
    course: Course
}

export const CourseProfileItem: FC<CourseProfileItemProps> = ({ course }) => {
    const { userProfileStore, courseStore } = useMobxStores();
    const router = useRouter();

    const [form] = Form.useForm<CourseReview>()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleReviewSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (!values.rating || values.rating === 0) {
                form.setFields([
                    {
                        name: "rating",
                        errors: ["Пожалуйста, поставьте оценку (минимум 0.5 звезды)."],
                    },
                ]);
                return;
            }

            console.log("Отправка отзыва:", values);

            courseStore.handleReviewSubmitCourse({ ...values, courseId: course.courseId })

            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.log("Ошибка валидации:", error);
        }
    };



    return (
        <>
            <Modal
                title={`Оставить отзыв для курса "${course.name}"`}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false)
                    form.resetFields()
                }}
                onOk={handleReviewSubmit}
                okText="Отправить"
                cancelText="Отмена"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="rating"
                        label="Оцените курс"
                        rules={[{ required: true, message: "Пожалуйста, поставьте оценку" }]}
                    >
                        <Rate allowHalf />
                    </Form.Item>

                    <Form.Item
                        name="review"
                        label="Ваш отзыв"
                        rules={[{ required: true, message: "Пожалуйста, напишите отзыв" }]}
                    >
                        <Input.TextArea rows={4} placeholder="Напишите свой отзыв о курсе..." />
                    </Form.Item>
                </Form>
            </Modal>
            <div key={course.courseId} className="p-4 bg-gray-50 mt-4 rounded-md shadow-md">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        {
                            course.image ?
                                <Image src={`${nextConfig.env!.API_URL}${course?.image}`} alt={course.name} width={100}
                                    height={60} className="mr-4" />
                                : <div
                                    style={{
                                        width: 100,
                                        height: 60,
                                        borderRadius: 4,
                                    }}
                                    className="mr-4 flex items-center justify-center bg-[#f0f0f0]"
                                >
                                    <BookOutlined style={{ fontSize: 30, color: '#8c8c8c' }} />
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
                        <Button type="default" className="ml-2" onClick={() => setIsModalOpen(true)}>
                            Оставить отзыв
                        </Button>
                    </div>
                </div>
                <Progress percent={course.progress} strokeColor={MAIN_COLOR} />
            </div>
        </>

    )
}