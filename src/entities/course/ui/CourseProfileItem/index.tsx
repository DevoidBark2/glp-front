import {Button, Dropdown, Form, Input, message, Modal, notification, Progress, Rate, Typography} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import Image from "next/image";
import {
    BookOutlined,
    PlayCircleOutlined,
    LogoutOutlined,
    MessageOutlined,
    DownloadOutlined,
    EllipsisOutlined
} from "@ant-design/icons";

import { Course, CourseReview } from "@/shared/api/course/model";
import { FORMAT_VIEW_DATE } from "@/shared/constants";
import { useMobxStores } from "@/shared/store/RootStore";
import nextConfig from "next.config.mjs";

interface CourseProfileItemProps {
    course: Course;
}

export const CourseProfileItem: FC<CourseProfileItemProps> = ({ course }) => {
    const { userProfileStore, courseStore } = useMobxStores();
    const router = useRouter();

    console.log(course)
    const [form] = Form.useForm<CourseReview>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalLeaveCourse, setIsModalLeaveCourse] = useState(false);

    const handleReviewSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (!values.rating || values.rating === 0) {
                form.setFields([
                    { name: "rating", errors: ["Пожалуйста, поставьте оценку (минимум 0.5 звезды)."] },
                ]);
                return;
            }

            courseStore.handleReviewSubmitCourse({ ...values, courseId: course.id }).then(response => {
                message.success(response.message)
                setIsModalOpen(false);
                form.resetFields();
            }).catch(e => {
                message.error(e.response.data.message)
                setIsModalOpen(false);
                form.resetFields();
            });

        } catch (error) {
            console.error("Ошибка валидации:", error);
        }
    };

    const handleDownloadCertificate = () => {
        courseStore.handleDownloadCertificate(course.id)
    };

    const items = [
        {
            key: "1",
            label: "Перейти к курсу",
            icon: <PlayCircleOutlined />,
            onClick: () => router.push(`/platform/lessons/${course.id}`)
        },
        {
            key: "2",
            label: "Покинуть курс",
            icon: <LogoutOutlined />,
            onClick: () => setIsModalLeaveCourse(true)
        },
        {
            key: "3",
            label: "Оставить отзыв",
            icon: <MessageOutlined />,
            onClick: () => setIsModalOpen(true)
        }
    ];

    if (course.has_certificate) {
        items.push({
            key: "4",
            label: "Скачать сертификат",
            icon: <DownloadOutlined />,
            onClick: handleDownloadCertificate
        });
    }

    return (
        <>
            <Modal
                centered
                title={`Оставить отзыв для курса "${course.name}"`}
                open={isModalOpen}
                onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
                footer={null}
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
                        rules={[
                            { required: true, message: "Пожалуйста, напишите отзыв" },
                            { max: 300, message: "Превышен максимальный размер отзыва" }
                        ]}
                    >
                        <Input.TextArea rows={4} placeholder="Напишите свой отзыв о курсе..." />
                    </Form.Item>

                    <div className="flex items-center justify-end gap-2">
                        <Button onClick={() => { setIsModalOpen(false); form.resetFields(); }}>Отменить</Button>
                        <Button variant="solid" color="default" onClick={() => handleReviewSubmit()}>Отправить</Button>
                    </div>
                </Form>
            </Modal>

            <Modal
                open={isModalLeaveCourse}
                onCancel={() => setIsModalLeaveCourse(false)}
                footer={null}
                centered
                className="custom-modal"
            >
                <div className="text-center p-4">
                    <Typography.Title level={4} className="mb-3">
                        Вы уверены, что хотите покинуть курс?
                    </Typography.Title>

                    <Typography.Text type="secondary">
                        Это действие нельзя отменить. Убедитесь, что вы приняли верное решение.
                    </Typography.Text>

                    <div className="flex justify-center gap-4 mt-6">
                        <Button onClick={() => setIsModalLeaveCourse(false)}>
                            Отмена
                        </Button>

                        <Button
                            type="primary"
                            danger
                            onClick={() => userProfileStore.confirmLeaveCourse(course.id).then(response => {
                                notification.success({message: response.message})
                            })}
                        >
                            Покинуть курс
                        </Button>
                    </div>
                </div>
            </Modal>


            <div key={course.id} className="p-4 border rounded-lg bg-white dark:bg-gray-900 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {course.image ? (
                            <Image
                                src={`${nextConfig.env!.API_URL}${course.image}`}
                                alt={course.name}
                                width={100}
                                height={70}
                                className="rounded-md w-auto h-auto"
                            />

                        ) : (
                            <div className="w-[100px] h-[70px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-md">
                                <BookOutlined style={{ fontSize: 32, color: "#999" }} />
                            </div>
                        )}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white break-words" style={{ wordBreak: "break-word" }}>{course.name}</h3>
                            <p className="text-gray-500 text-sm">
                                Дата записи: {dayjs(course.enrolledAt).format(FORMAT_VIEW_DATE)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Dropdown menu={{items}} trigger={['click']}>
                            <Button
                                type="default"
                                shape="default"
                                icon={<EllipsisOutlined />}
                            />
                        </Dropdown>
                    </div>
                </div>

                <Progress percent={course.progress} strokeColor="#4a90e2" className="mt-4" />
            </div>
        </>

    );
};
