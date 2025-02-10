import { Course, CourseReview } from "@/shared/api/course/model";
import { Button, Form, Input, Modal, Popconfirm, Progress, Rate, Tooltip } from "antd";
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

            courseStore.handleReviewSubmitCourse({ ...values, courseId: course.courseId });
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
                onCancel={() => { setIsModalOpen(false); form.resetFields(); }}
                onOk={handleReviewSubmit}
                okText="Отправить"
                cancelText="Отмена"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="rating" label="Оцените курс" rules={[{ required: true, message: "Пожалуйста, поставьте оценку" }]}>
                        <Rate allowHalf />
                    </Form.Item>
                    <Form.Item name="review" label="Ваш отзыв" rules={[{ required: true, message: "Пожалуйста, напишите отзыв" }, { max: 300, message: "Превышен максимальный размер отзыва" }]}>
                        <Input.TextArea rows={4} placeholder="Напишите свой отзыв о курсе..." />
                    </Form.Item>
                </Form>
            </Modal>
            <div key={course.courseId} className="p-6 shadow-lg relative overflow-hidden bg-transparent">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        {course.image ? (
                            <Image src={`${nextConfig.env!.API_URL}${course?.image}`} alt={course.name} width={120} height={80} className="mr-4 neon-glow" />
                        ) : (
                            <div className="w-[120px] h-[80px] bg-gray-800 flex items-center justify-center rounded-lg neon-glow">
                                <BookOutlined style={{ fontSize: 40, color: "#ff007f" }} />
                            </div>
                        )}
                        <div>
                            <h3 className="text-2xl font-bold text-neon-pink">{course.name}</h3>
                            <p className="text-gray-400">Дата записи: {dayjs(course.enrolledAt).format(FORMAT_VIEW_DATE)}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Tooltip title={`Перейти к курсу "${course.name}"`}>
                            <Button type="primary" className="neon-button" onClick={() => router.push(`/platform/lessons/${course.courseId}`)} icon={<PlayCircleOutlined />} />
                        </Tooltip>
                        <Popconfirm title="Вы уверены?" onConfirm={() => userProfileStore.confirmLeaveCourse(course.courseId)} placement="leftBottom" okText="Да" cancelText="Нет">
                            <Button danger className="ml-2 neon-button" icon={<LogoutOutlined />} />
                        </Popconfirm>
                        <Button type="default" className="ml-2 neon-button" onClick={() => setIsModalOpen(true)} icon={<MessageOutlined />} />
                    </div>
                </div>
                <Progress percent={course.progress} strokeColor="#ff007f" className="neon-progress" />
            </div>
        </>
    );
};
