"use client"
import { Table, Divider, Button, Modal, Input, Avatar, Badge, Select, notification } from "antd";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { SmileOutlined, SearchOutlined } from '@ant-design/icons';

const feedBackPage = () => {
    // Пример данных пользователей с чатами
    const [chats, setChats] = useState([
        {
            id: 1,
            user: { id: 101, name: "Иван Иванов", avatar: "/static/avatar1.jpg", status: "online" },
            lastMessage: "Спасибо за вашу помощь!",
            lastActivity: "2024-09-12 14:30",
            unread: 2
        },
        {
            id: 2,
            user: { id: 102, name: "Мария Петрова", avatar: "/static/avatar2.jpg", status: "offline" },
            lastMessage: "Когда будет ответ?",
            lastActivity: "2024-09-11 11:45",
            unread: 0
        },
        // Пример ещё нескольких чатов
    ]);

    // Состояние для модального окна
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentChat, setCurrentChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Открытие модального окна с чатом
    const openChatModal = (chat: any) => {
        setCurrentChat(chat);
        setIsModalVisible(true);
    };

    // Закрытие модального окна
    const closeModal = () => {
        setIsModalVisible(false);
        setCurrentChat(null);
    };

    // Обработка ввода сообщения
    const handleSendMessage = () => {
        if (newMessage.trim() !== "") {
            // Логика для добавления сообщения в чат
            setNewMessage("");
            // notification.success({
            //     message: 'Сообщение отправлено',
            //     description: `Ваше сообщение было отправлено ${currentChat?.user?.name}.`,
            // });
        }
    };
    // Фильтрация чатов по поиску
    const filteredChats = chats.filter(chat => chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()));

    // Колонки для таблицы
    const columns = [
        {
            title: "Пользователь",
            dataIndex: "user",
            key: "user",
            render: (user: any) => (
                <div className="flex items-center">
                    <Badge dot={user.status === "online"} offset={[-5, 5]} color={user.status === "online" ? "green" : "gray"}>
                        <Avatar src={user.avatar} alt={user.name} />
                    </Badge>
                    <span className="ml-3 font-bold">{user.name}</span>
                </div>
            )
        },
        {
            title: "Последнее сообщение",
            dataIndex: "lastMessage",
            key: "lastMessage",
            render: (text: string) => (
                <span>{text.length > 30 ? `${text.slice(0, 30)}...` : text}</span>
            )
        },
        // {
        //     title: "Непрочитанные",
        //     dataIndex: "unread",
        //     key: "unread",
        //     render: (unread) => (
        //         <span className={`font-bold ${unread > 0 ? "text-red-600" : "text-gray-500"}`}>
        //             {unread > 0 ? `${unread} новых` : "Нет"}
        //         </span>
        //     )
        // },
        {
            title: "Действия",
            key: "actions",
            render: (_: any, chat: any) => (
                <Button type="primary" onClick={() => openChatModal(chat)}>
                    Открыть чат
                </Button>
            )
        }
    ];

    return (
        <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto rounded" style={{ height: 'calc(100vh - 60px)' }}>
            <div className="flex items-center justify-between">
                <h1 className="text-gray-800 font-bold text-3xl mb-2">Переписки с пользователями</h1>
            </div>
            <Divider />

            {/* Поиск по чату */}
            <Input
                placeholder="Поиск по имени пользователя"
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: "20px", maxWidth: "400px" }}
            />

            {/* Таблица чатов */}
            <Table
                dataSource={filteredChats}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
            />

            {/* Модальное окно с чатом */}
            {currentChat && (
                <Modal
                    // title={
                    //     <div className="flex items-center">
                    //         <Avatar src={currentChat.user.avatar} alt={currentChat.user.name} size={40} />
                    //         <div className="ml-3">
                    //             <h2 className="text-lg font-bold">{currentChat.user.name}</h2>
                    //             <p className={`text-sm ${currentChat.user.status === "online" ? "text-green-500" : "text-gray-400"}`}>
                    //                 {currentChat.user.status === "online" ? "В сети" : "Оффлайн"}
                    //             </p>
                    //         </div>
                    //     </div>
                    // }
                    open={isModalVisible}
                    onCancel={closeModal}
                    footer={[
                        <Button key="close" onClick={closeModal}>Закрыть</Button>,
                        <Button key="send" type="primary" onClick={handleSendMessage}>
                            Отправить сообщение
                        </Button>
                    ]}
                    bodyStyle={{ maxHeight: '60vh', overflowY: 'auto' }} // Для прокрутки длинных переписок
                >
                    {/* История сообщений */}
                    <div className="chat-history">
                        <div className="mb-4">
                            <div className="message message-admin">
                                <div className="message-bubble">
                                    <strong>Админ</strong>
                                    <p>Добрый день! Как можем помочь?</p>
                                    <span className="text-xs text-gray-500">10:00</span>
                                </div>
                            </div>

                            <div className="message message-user">
                                <div className="message-bubble">
                                    {/*<strong>{currentChat.user.name}</strong>*/}
                                    {/*<p>{currentChat.lastMessage}</p>*/}
                                    {/*<span className="text-xs text-gray-500">10:05</span>*/}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Поле для ввода нового сообщения */}
                    <div className="new-message-container">
                        <Input.TextArea
                            rows={3}
                            placeholder="Введите ваше сообщение"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            style={{ marginBottom: "10px", borderRadius: '10px' }}
                        />

                        {/* Кнопки для отправки */}
                        <div className="flex justify-between items-center">
                            <Button icon={<SmileOutlined />} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                                Emoji
                            </Button>
                            <Button type="primary" onClick={handleSendMessage}>Отправить</Button>
                        </div>
                    </div>
                </Modal>
            )}


        </div>
    )
}

export default observer(feedBackPage);
