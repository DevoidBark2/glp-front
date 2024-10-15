"use client";
import Image from "next/image";
import { Button, Divider, Form, Input, Modal, Progress, Skeleton, Upload, Tooltip, Rate, List, Badge, Calendar, Spin, Avatar, UploadFile, Empty } from "antd";
import { UploadOutlined, EditOutlined, ExclamationCircleOutlined, MessageOutlined, TrophyOutlined, SaveOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import { useMobxStores } from "@/stores/stores";
import React, { useEffect, useState } from "react";
import { FeedBackItem } from "@/stores/FeedBacksStore";
import { Course } from "@/stores/CourseStore";
import { UploadChangeParam } from "antd/lib/upload";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
    const { userStore, userProfileStore, feedBacksStore } = useMobxStores();
    const [form] = Form.useForm();
    const [formProfile] = Form.useForm();
    const [userCourses, setUserCourses] = useState<Course[]>([]);
    const [previewImage, setPreviewImage] = useState("/static/profile_photo.jpg");
    const [isEditing, setIsEditing] = useState(false);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const router = useRouter();

    const [loadingProfile, setLoadingProfile] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        setIsModalVisible(false);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const onAvatarChange = (info) => {
        setLoadingAvatar(true);
        // Заглушка для загрузки аватара
        setTimeout(() => {
            setLoadingAvatar(false);
            // Здесь обновите previewImage
        }, 2000);
    };

    const handleAvatarChange = (file) => {
        const reader = new FileReader();
        reader.onload = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file.file.originFileObj);
    };

    const [userLevel, setUserLevel] = useState(3); // Уровень пользователя
    const [userXP, setUserXP] = useState(150); // Очки опыта пользователя
    const maxXP = 200; // Максимальное количество очков опыта для повышения уровня


    const confirmLeaveCourse = (courseId: number) => {
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

    const recommendedCourses = [
        { id: 1, name: "Основы Python", image: "https://example.com/python.png" },
        { id: 2, name: "React для начинающих", image: "https://example.com/react.png" },
    ];
    const achievements = [
        { title: "Завершил первый курс", icon: <TrophyOutlined />, description: "Поздравляем! Вы завершили свой первый курс." },
        { title: "5 звёзд за курс", icon: <TrophyOutlined />, description: "Вы получили максимальный рейтинг за курс." },
        { title: "5 звёзд за курс", icon: <TrophyOutlined />, description: "Вы получили максимальный рейтинг за курс." }
    ];

    const handleCalendarSelect = (date) => {
        Modal.info({
            title: "Планируйте своё обучение",
            content: `Вы выбрали дату: ${date.format('YYYY-MM-DD')}. Вы можете запланировать учебную сессию на этот день.`,
        });
    };
    const [loadingAvatar, setLoadingAvatar] = useState(false);

    // // Показывать спин при загрузке аватара
    // const onAvatarChange = (info: UploadChangeParam<UploadFile<any>>) => {
    //     setLoadingAvatar(true);
    //     handleAvatarChange(info);
    //     setTimeout(() => {
    //         setLoadingAvatar(false);
    //     }, 1500); // Симулируем время загрузки
    // };

    useEffect(() => {
        setLoadingProfile(false)
        userProfileStore.getUserProfile?.().then(() => {
            formProfile.setFieldsValue(userProfileStore.userProfileDetails);
        });
        feedBacksStore.getFeedBackForUser();
    }, []);

    return (
        !userProfileStore.loading ? (
            <div className="container mx-auto mb-4">
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

                <h1 className="text-gray-800 text-4xl my-5 font-bold">Профиль пользователя</h1>

                <Divider/>

                <div className="flex gap-6 mt-2">
                    {/* Левая часть - профиль */}
                    <div className="w-2/5 bg-white flex flex-col rounded-md shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
                        <div className="flex justify-center mb-4">
                            {/* Спин вокруг изображения при загрузке */}
                            <Spin spinning={loadingAvatar} tip="Загрузка...">
                                <Image className="rounded-full" src={previewImage} alt="Картинка профиля" width={200} height={200} />
                            </Spin>
                        </div>

                        <div className="flex justify-center mb-4">
                            <Upload onChange={onAvatarChange} showUploadList={false}>
                                <Button icon={<UploadOutlined />}>Загрузить аватар</Button>
                            </Upload>
                        </div>

                        {/* Скелетон для полей формы пока профиль загружается */}
                        {loadingProfile ? (
                            <Skeleton active paragraph={{ rows: 6 }} />
                        ) : (
                            <Form form={formProfile} layout="vertical">
                                <Form.Item name="first_name" label="Имя">
                                    <Input
                                        className="h-12 rounded-md transition-all duration-300"
                                        placeholder="Введите имя"
                                        disabled={!isEditing}
                                    />
                                </Form.Item>

                                <Form.Item name="second_name" label="Фамилия">
                                    <Input
                                        className="h-12 rounded-md transition-all duration-300"
                                        placeholder="Введите фамилию"
                                        disabled={!isEditing}
                                    />
                                </Form.Item>

                                <Form.Item name="email" label="Email">
                                    <Input
                                        className="h-12 rounded-md transition-all duration-300"
                                        placeholder="Введите email"
                                        disabled={!isEditing}
                                    />
                                </Form.Item>

                                <Form.Item name="phone" label="Телефон">
                                    <Input
                                        className="h-12 rounded-md transition-all duration-300"
                                        placeholder="Введите телефон"
                                        disabled={!isEditing}
                                    />
                                </Form.Item>

                                <div className="flex justify-between items-center mt-4">
                                    <div className="flex flex-col">
                                        {/* Кнопка сохранения с анимацией */}
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                className={`transition-all duration-300 ease-in-out transform ${isEditing ? "hover:scale-105" : "hover:scale-100"
                                                    }`}
                                                disabled={!isEditing}
                                                icon={<SaveOutlined />}
                                            >
                                                Сохранить
                                            </Button>
                                        </Form.Item>

                                        {/* Кнопка редактирования с анимацией */}
                                        <Button
                                            icon={<EditOutlined />}
                                            className="transition-all duration-300 ease-in-out hover:bg-gray-50 hover:text-blue-500"
                                            onClick={() => setIsEditing(!isEditing)}
                                        >
                                            {isEditing ? "Отменить" : "Редактировать профиль"}
                                        </Button>
                                    </div>

                                    {/* Кнопка для открытия модального окна */}
                                    <Button
                                        icon={<InfoCircleOutlined />}
                                        className="transition-all duration-300 ease-in-out hover:bg-gray-50 hover:text-blue-500"
                                        onClick={showModal}
                                    >
                                        Подробнее
                                    </Button>
                                </div>
                            </Form>
                        )}

                        {/* Модальное окно с подробной информацией */}
                        <Modal
                            title="Информация о пользователе"
                            visible={isModalVisible}
                            onOk={handleModalOk}
                            onCancel={handleModalCancel}
                            footer={[
                                <Button key="back" onClick={handleModalCancel}>
                                    Закрыть
                                </Button>,
                                <Button key="submit" type="primary" onClick={handleModalOk}>
                                    Сохранить изменения
                                </Button>,
                            ]}
                        >
                            <Form form={formProfile} layout="vertical">
                                <Form.Item name="first_name" label="Имя">
                                    <Input
                                        className="h-12 rounded-md transition-all duration-300"
                                        placeholder="Введите имя"
                                        disabled={!isEditing}
                                    />
                                </Form.Item>

                                <Form.Item name="second_name" label="Фамилия">
                                    <Input
                                        className="h-12 rounded-md transition-all duration-300"
                                        placeholder="Введите фамилию"
                                        disabled={!isEditing}
                                    />
                                </Form.Item>

                                <Form.Item name="email" label="Email">
                                    <Input
                                        className="h-12 rounded-md transition-all duration-300"
                                        placeholder="Введите email"
                                        disabled={!isEditing}
                                    />
                                </Form.Item>

                                <Form.Item name="phone" label="Телефон">
                                    <Input
                                        className="h-12 rounded-md transition-all duration-300"
                                        placeholder="Введите телефон"
                                        disabled={!isEditing}
                                    />
                                </Form.Item>

                                <Form.Item name="address" label="Адрес">
                                    <Input.TextArea
                                        className="rounded-md transition-all duration-300"
                                        placeholder="Введите адрес"
                                        disabled={!isEditing}
                                        rows={3}
                                    />
                                </Form.Item>

                                <Form.Item name="about" label="О себе">
                                    <Input.TextArea
                                        className="rounded-md transition-all duration-300"
                                        placeholder="Введите информацию о себе"
                                        disabled={!isEditing}
                                        rows={3}
                                    />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>

                    {/* Правая часть - курсы */}
                    <div className="w-3/5 bg-white rounded-md shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">Ваши курсы</h2>
                        <Divider />

                        {loadingCourses ? (
                            <Skeleton active />
                        ) : (
                            1 > 5 ? userCourses.map(course => (
                                <div key={course.id} className="p-4 bg-gray-50 mt-4 rounded-md shadow-md hover:bg-white hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <img src={course.image} alt={course.name} width={50} height={50} className="rounded-lg mr-4" />
                                            <div>
                                                <h3 className="text-xl font-semibold">{course.name}</h3>
                                                <p className="text-gray-600">{course.small_description}</p>
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
                                    <Progress percent={course.level} strokeColor="#87d068" />
                                </div>
                            )) : <div className="flex items-center justify-center h-3/4">
                                <Empty description={<div className="flex flex-col">
                                    <span>Список пуст</span>
                                    <Button type="primary" className="mt-2" onClick={() => router.push('/platform/courses')}>Перейти к списку</Button>
                                </div>} />
                            </div>
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
                                <p className="text-gray-600 mt-2">Ваш рейтинг: 2/5</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Форма обратной связи */}
                <div className="mt-12 bg-white rounded-md shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4">Обратная связь</h2>
                    <Divider />
                    <Form
                        form={form}
                        onFinish={(values) => feedBacksStore.sendFeedback(values).then(() => {
                            form.resetFields();
                        })}
                    >
                        <Form.Item name="message" rules={[{ required: true, message: "Сообщение не может быть пустым!" }]}>
                            <Input.TextArea
                                rows={4}
                                placeholder="Оставьте ваш отзыв или предложение"
                            />
                        </Form.Item>

                        {/* Компонент для загрузки файлов */}
                        <Form.Item>
                            <Upload
                                name="files"
                                fileList={feedBacksStore.fileListForFeedback}
                                onChange={({ fileList }: { fileList: UploadFile[] }) => {
                                    feedBacksStore.setFileForFeedBack(fileList);
                                }}
                                multiple
                                beforeUpload={() => false}
                            >
                                <Button icon={<UploadOutlined />}>Прикрепить файлы</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Отправить</Button>
                        </Form.Item>
                    </Form>
                </div>

                <div className="container mx-auto mt-12">


                    {/* История переписки */}
                    <div className="bg-white rounded-md shadow-lg p-6 mb-6 transition-all duration-300 hover:shadow-2xl">
                        <h2 className="text-2xl font-bold mb-4">Переписка с администратором</h2>
                        <Divider />
                        <div className="chat-history max-h-96 overflow-y-auto">
                            <List
                                itemLayout="horizontal"
                                dataSource={feedBacksStore.feedBackItems}
                                renderItem={(message: FeedBackItem) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            // avatar={
                                            //     message.sender === "admin" ? (
                                            //         <Avatar style={{ backgroundColor: "#f56a00" }}>A</Avatar>
                                            //     ) : (
                                            //         <Avatar style={{ backgroundColor: "#87d068" }}>U</Avatar>
                                            //     )
                                            // }
                                            // title={
                                            //     <span className={message.sender === "admin" ? "text-blue-600" : "text-green-600"}>
                                            //         {message.sender === "admin" ? "Админ" : "Вы"}{" "}
                                            //         <span className="text-gray-500 text-sm">{message.timestamp}</span>
                                            //     </span>
                                            // }
                                            description={message.message}
                                            title={message.sender.first_name}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    </div>
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

                {/* Прогресс-бар с уровнем пользователя */}
                <div className="mt-12 bg-white rounded-md shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4">Ваш уровень</h2>
                    <Divider />
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg">Уровень: {userLevel}</h3>
                        <Progress percent={(userXP / maxXP) * 100} status="active" />
                    </div>
                    <p className="text-gray-600 mt-2">Опыт: {userXP}/{maxXP} XP</p>
                </div>

                {/* Блок с наградами */}
                <div className="mt-12 bg-white rounded-md shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4">Ваши достижения</h2>
                    <Divider />
                    <div className="grid grid-cols-2 gap-4">
                        {achievements.map((achieve, index) => (
                            <Badge.Ribbon key={index} text="Награда" color="gold">
                                <div className="p-4 bg-gray-50 rounded-md shadow-md flex items-center">
                                    {achieve.icon}
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold">{achieve.title}</h3>
                                        <p className="text-gray-600">{achieve.description}</p>
                                    </div>
                                </div>
                            </Badge.Ribbon>
                        ))}
                    </div>
                </div>

                {/* Календарь для планирования обучения */}
                {/* <div className="mt-12 bg-white rounded-md shadow-lg p-6 transition-all duration-300 hover:shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4">Календарь обучения</h2>
                    <Divider />
                    <Calendar fullscreen={false} onSelect={handleCalendarSelect} />
                </div> */}

                {/* Чат с поддержкой */}
                {/* <div className="fixed bottom-6 right-6">
                    <Tooltip title="Чат с поддержкой">
                        <Button shape="circle" icon={<MessageOutlined />} size="large" />
                    </Tooltip>
                </div> */}
            </div>
        ) : <div className="flex justify-center">
            <Spin size="large" />
        </div>
    );
};

export default observer(ProfilePage);
