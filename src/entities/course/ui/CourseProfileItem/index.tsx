import { Course, CourseReview } from "@/shared/api/course/model";
import { Button, Form, Input, message, Modal, Popconfirm, Progress, Rate, Tooltip } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import Image from "next/image";
import { BookOutlined, PlayCircleOutlined, LogoutOutlined, MessageOutlined } from "@ant-design/icons";
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
                        <Tooltip title={`Перейти к курсу "${course.name}"`}>
                            <Button
                                type="default"
                                shape="circle"
                                onClick={() => router.push(`/platform/lessons/${course.id}`)}
                                icon={<PlayCircleOutlined />}
                            />
                        </Tooltip>

                        <Tooltip title="Покинуть курс">
                            <Popconfirm
                                title="Вы уверены, что хотите покинь курс, весь прогресс по курсу удалится?"
                                onConfirm={() => userProfileStore.confirmLeaveCourse(course.id)}
                                placement="top"
                                okText="Да"
                                cancelText="Нет"
                            >
                                <Button shape="circle" danger icon={<LogoutOutlined />} />
                            </Popconfirm>
                        </Tooltip>

                        <Tooltip title="Оставить отзыв">
                            <Button
                                type="default"
                                shape="circle"
                                onClick={() => setIsModalOpen(true)}
                                icon={<MessageOutlined />}
                            />
                        </Tooltip>
                    </div>
                </div>

                <Progress percent={course.progress} strokeColor="#4a90e2" className="mt-4" />
            </div>
        </>

    );
};
