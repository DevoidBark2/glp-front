"use client";
import Image from "next/image";
import {Button, Divider, Form, Input, Modal, Progress, Skeleton, Upload, Tooltip, Rate, List} from "antd";
import {UploadOutlined, EditOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {observer} from "mobx-react";
import {useMobxStores} from "@/stores/stores";
import React, {useEffect, useState} from "react";

const ProfilePage = () => {
    const {userStore} = useMobxStores();
    const [form] = Form.useForm();
    const [userCourses, setUserCourses] = useState([
        {id: 1, name: "Курс по HTTP", image: "https://cdn.stepik.net/media/cache/images/courses/194856/cover_Sl6ky3x/2023ab5a2b085ae4307c6d4e981c7a68.png", progress: 50, description: "Основы HTTP-протоколов."},
        {id: 2, name: "Курс по Java", image: "https://cdn.stepik.net/media/cache/images/courses/194856/cover_Sl6ky3x/2023ab5a2b085ae4307c6d4e981c7a68.png", progress: 75, description: "Углубленный курс по Java."},
    ]);
    const [previewImage, setPreviewImage] = useState("/static/profile_photo.jpg");
    const [isEditing, setIsEditing] = useState(false);
    const [loadingCourses, setLoadingCourses] = useState(false);

    useEffect(() => {
        userStore.getUserProfile?.().then(() => {
            form.setFieldsValue(userStore.userProfileDetails);
        });
    }, []);

    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(0);

    const handleAvatarChange = (file) => {
        const reader = new FileReader();
        reader.onload = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file.file.originFileObj);
    };

    const confirmLeaveCourse = (courseId) => {
        Modal.confirm({
            title: "Вы уверены, что хотите покинуть курс?",
            icon: <ExclamationCircleOutlined />,
            content: "Это действие нельзя отменить.",
            onOk() {
                // Логика покидания курса
                setUserCourses(userCourses.filter(course => course.id !== courseId));
            },
        });
    };

    const handleFeedbackSubmit = () => {
        if (feedback) {
            Modal.success({
                title: 'Спасибо за ваш отзыв!',
                content: 'Мы получили ваш отзыв и учтём его в будущем.',
            });
            setFeedback('');
        }
    };

    const recommendedCourses = [
        {id: 1, name: "Основы Python", image: "https://example.com/python.png"},
        {id: 2, name: "React для начинающих", image: "https://example.com/react.png"},
    ];

    return (
        !userStore.loading ? (
            <div className="container mx-auto">
                {/* Модальное окно для покидания курса */}
                <Modal
                    open={userStore.openLeaveCourseModal}
                    onCancel={() => userStore.setOpenLeaveCourseModal(false)}
                    title="Покинуть курс?"
                    okText="Да"
                    cancelText="Нет"
                >
                    Вы уверены, что хотите покинуть курс? Это действие нельзя отменить.
                </Modal>

                <h1 className="text-4xl my-5 text-center font-bold">Профиль пользователя</h1>

                <div className="flex gap-6">
                    {/* Левая часть - профиль */}
                    <div className="w-2/5 bg-white flex flex-col rounded-md shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
                        <div className="flex justify-center mb-4">
                            <Image className="rounded-full" src={previewImage} alt="Картинка профиля" width={200} height={200} />
                        </div>
                        <div className="flex justify-center mb-4">
                            <Upload onChange={handleAvatarChange} showUploadList={false}>
                                <Button icon={<UploadOutlined />}>Загрузить аватар</Button>
                            </Upload>
                        </div>

                        <Form form={form} layout="vertical">
                            <Form.Item name="first_name" label="Имя">
                                <Input className="h-12 rounded-md" placeholder="Введите имя" disabled={!isEditing} />
                            </Form.Item>
                            <Form.Item name="second_name" label="Фамилия">
                                <Input className="h-12 rounded-md" placeholder="Введите фамилию" disabled={!isEditing} />
                            </Form.Item>

                            <div className="flex flex-col items-center">
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" disabled={!isEditing}>Сохранить</Button>
                                </Form.Item>
                                <Button icon={<EditOutlined />} onClick={() => setIsEditing(!isEditing)}>
                                    {isEditing ? "Отменить" : "Редактировать профиль"}
                                </Button>
                            </div>
                        </Form>
                    </div>

                    {/* Правая часть - курсы */}
                    <div className="w-3/5 bg-white rounded-md shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">Ваши курсы</h2>
                        <Divider />

                        {loadingCourses ? (
                            <Skeleton active />
                        ) : (
                            userCourses.map(course => (
                                <div key={course.id} className="p-4 bg-gray-50 mt-4 rounded-md shadow-md hover:bg-white hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <img src={course.image} alt={course.name} width={50} height={50} className="rounded-lg mr-4" />
                                            <div>
                                                <h3 className="text-xl font-semibold">{course.name}</h3>
                                                <p className="text-gray-600">{course.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Tooltip title="Продолжить курс">
                                                <Button type="primary">Продолжить</Button>
                                            </Tooltip>
                                            <Button
                                                danger
                                                className="ml-2"
                                                onClick={() => confirmLeaveCourse(course.id)}
                                            >Покинуть курс</Button>
                                        </div>
                                    </div>
                                    <Progress percent={course.progress} strokeColor="#87d068" />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Дополнительные интерактивные блоки */}

                {/* Блок с рейтингом курсов */}
                <div className="mt-12 bg-white rounded-md shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4">Оцените ваши курсы</h2>
                    <Divider />
                    <div className="grid grid-cols-2 gap-4">
                        {userCourses.map(course => (
                            <div key={course.id} className="flex flex-col items-center bg-gray-50 p-4 rounded-md shadow-md">
                                <h3 className="text-xl font-semibold">{course.name}</h3>
                                <Rate onChange={(value) => setRating(value)} value={rating} />
                                <p className="text-gray-600 mt-2">Ваш рейтинг: {rating}/5</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Форма обратной связи */}
                <div className="mt-12 bg-white rounded-md shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4">Обратная связь</h2>
                    <Divider />
                    <Form onFinish={handleFeedbackSubmit}>
                        <Form.Item>
                            <Input.TextArea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={4}
                                placeholder="Оставьте ваш отзыв или предложение"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Отправить</Button>
                        </Form.Item>
                    </Form>
                </div>

                {/* Рекомендуемые курсы */}
                <div className="mt-12 bg-white rounded-md shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4">Рекомендуемые курсы</h2>
                    <Divider />
                    <div className="grid grid-cols-2 gap-4">
                        {recommendedCourses.map(course => (
                            <div key={course.id} className="flex items-center bg-gray-50 p-4 rounded-md shadow-md hover:bg-white hover:shadow-lg">
                                <img src={course.image} alt={course.name} width={50} height={50} className="rounded-lg mr-4" />
                                <div>
                                    <h3 className="text-xl font-semibold">{course.name}</h3>
                                    <Button type="primary">Записаться</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* История активности */}
                <div className="mt-12 bg-white rounded-md shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4">История активности</h2>
                    <Divider />
                    <List
                        bordered
                        dataSource={[
                            "Начал курс по HTTP",
                            "Завершил урок: Основы HTTP",
                            "Записался на курс по Java",
                        ]}
                        renderItem={item => (
                            <List.Item>{item}</List.Item>
                        )}
                    />
                </div>
            </div>
        ) : <Skeleton active />
    );
};

export default observer(ProfilePage);
