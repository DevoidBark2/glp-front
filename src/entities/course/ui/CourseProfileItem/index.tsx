import {Button, Dropdown, Form, Input, Menu, message, Modal, Popconfirm, Progress, Rate, Tooltip} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
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

    const [form] = Form.useForm<CourseReview>();
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            console.log("Ошибка валидации:", error);
        }
    };

    const handleDownloadCertificate = () => {
        // if (course.certificateUrl) {
        //     const link = document.createElement("a");
        //     link.href = ""; // Ссылка на сертификат
        //     link.download = `certificate-${course.name}.pdf`; // Имя файла для сертификата
        //     link.click();
        // } else {
        //     message.error("Сертификат недоступен.");
        // }
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
            onClick: () => userProfileStore.confirmLeaveCourse(course.id)
        },
        {
            key: "3",
            label: "Оставить отзыв",
            icon: <MessageOutlined />,
            onClick: () => setIsModalOpen(true)
        },
        {
            key: "4",
            label: "Скачать сертификат",
            icon: <DownloadOutlined />,
            onClick: handleDownloadCertificate
        }
    ];


    return (
        <>
            <Modal
                title={`Оставить отзыв для курса "${course.name}"`}
                open={isModalOpen}
                onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
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
                        rules={[
                            { required: true, message: "Пожалуйста, напишите отзыв" },
                            { max: 300, message: "Превышен максимальный размер отзыва" }
                        ]}
                    >
                        <Input.TextArea rows={4} placeholder="Напишите свой отзыв о курсе..." />
                    </Form.Item>
                </Form>
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
