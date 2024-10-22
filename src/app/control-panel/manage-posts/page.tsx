"use client";
import { observer } from "mobx-react";
import { Button, Divider, Input, Table, Tooltip, Modal, Form, Select, message, Popover } from "antd";
import React, { useEffect, useState } from "react";
import { CommentOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useMobxStores } from "@/stores/stores";
import { Post } from "@/stores/PostStore";
import { PostStatusEnum } from "@/enums/PostStatusEnum";

const ManagePostModal = ({ selectedPost, setSelectedPost, comment, handleCommentChange, status, handleStatusChange, handleSubmit, form }) => {
    const [fieldComments, setFieldComments] = useState({
        name: "",
        description: "",
        content: "",
    });

    const handleFieldCommentChange = (field: string, value: string) => {
        setFieldComments((prevComments) => ({ ...prevComments, [field]: value }));
    };

    return (
        selectedPost && (
            <Modal
                title={
                    <div className="flex items-center">
                        <InfoCircleOutlined className="mr-2 text-blue-500" />
                        <span>Проверка поста: {selectedPost.name}</span>
                    </div>
                }
                open={!!selectedPost}
                onCancel={() => setSelectedPost(null)}
                footer={null}
                centered
                width="70%"
                className="custom-moderation-modal"
            >
                <Form form={form} layout="vertical">
                    {/* Название поля с возможностью добавить комментарий */}
                    <Form.Item label="Название" name="name">
                        <div className="flex items-center justify-between">
                            <Input disabled />
                            <Popover
                                content={
                                    <Input.TextArea
                                        rows={2}
                                        value={fieldComments.name}
                                        onChange={(e) => handleFieldCommentChange("name", e.target.value)}
                                        placeholder="Введите комментарий"
                                    />
                                }
                                title="Комментарий для поля Название"
                                trigger="click"
                            >
                                <Tooltip title="Добавить комментарий к названию">
                                    <Button icon={<CommentOutlined />} className="ml-2" />
                                </Tooltip>
                            </Popover>
                        </div>
                    </Form.Item>

                    {/* Описание поля с комментарием */}
                    <Form.Item label="Описание" name="description">
                        <div className="flex items-center justify-between">
                            <Input.TextArea rows={3} disabled />
                            <Popover
                                content={
                                    <Input.TextArea
                                        rows={2}
                                        value={fieldComments.description}
                                        onChange={(e) => handleFieldCommentChange("description", e.target.value)}
                                        placeholder="Введите комментарий"
                                    />
                                }
                                title="Комментарий для поля Описание"
                                trigger="click"
                            >
                                <Tooltip title="Добавить комментарий к описанию">
                                    <Button icon={<CommentOutlined />} className="ml-2" />
                                </Tooltip>
                            </Popover>
                        </div>
                    </Form.Item>

                    {/* Контент поля с комментарием */}
                    <Form.Item label="Контент" name="content">
                        <div className="flex items-center justify-between">
                            <Input.TextArea rows={6} disabled />
                            <Popover
                                content={
                                    <Input.TextArea
                                        rows={2}
                                        value={fieldComments.content}
                                        onChange={(e) => handleFieldCommentChange("content", e.target.value)}
                                        placeholder="Введите комментарий"
                                    />
                                }
                                title="Комментарий для поля Контент"
                                trigger="click"
                            >
                                <Tooltip title="Добавить комментарий к контенту">
                                    <Button icon={<CommentOutlined />} className="ml-2" />
                                </Tooltip>
                            </Popover>
                        </div>
                    </Form.Item>

                    {/* Общий комментарий для автора */}
                    <Form.Item label="Общий комментарий для автора">
                        <Input.TextArea
                            rows={4}
                            value={comment}
                            onChange={handleCommentChange}
                            placeholder="Введите комментарий, если есть замечания"
                        />
                    </Form.Item>

                    {/* Статус поста */}
                    <Form.Item label="Статус">
                        <Select value={status} onChange={handleStatusChange}>
                            <Select.Option value={PostStatusEnum.APPROVED}>Approved</Select.Option>
                            <Select.Option value={PostStatusEnum.REJECTED}>Rejected</Select.Option>
                        </Select>
                    </Form.Item>

                    <Divider />

                    {/* Кнопки действия */}
                    <div className="flex justify-end gap-4">
                        <Button onClick={() => setSelectedPost(null)}>Отменить</Button>
                        <Button type="primary" onClick={handleSubmit}>
                            Отправить
                        </Button>
                    </div>
                </Form>
            </Modal>
        )
    );
};

const ManagePostPage = () => {
    const { moderatorStore } = useMobxStores();

    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [comment, setComment] = useState<string>("");
    const [status, setStatus] = useState<PostStatusEnum | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        moderatorStore.getPostForModerators();
    }, []);

    const handlePostSelect = (post: Post) => {
        setSelectedPost(post);
        setStatus(post.status); // Устанавливаем статус по умолчанию
        form.setFieldsValue({ ...post });
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    };

    const handleStatusChange = (value: PostStatusEnum) => {
        setStatus(value);
    };

    const handleSubmit = () => {
        // if (!status) {
        //     message.error("Пожалуйста, выберите статус для поста.");
        //     return;
        // }


        debugger
        // Здесь мы можем добавить логику для отправки обновленного статуса и комментария в хранилище MobX
        moderatorStore.updatePostStatus(selectedPost!.id, status, comment)
            .then(() => {
                message.success("Статус поста успешно обновлен.");
                setSelectedPost(null); // Закрыть модальное окно
                setComment(""); // Очистить комментарий
                form.resetFields(); // Сбросить форму
            })
            .catch(() => message.error("Произошла ошибка при обновлении поста."));
    };

    return (
        <div className="bg-white h-full p-5">
            <div className="bg-gray-50 p-5 rounded-lg shadow-md mb-5">
                <div className="flex items-center">
                    <InfoCircleOutlined className="text-2xl text-blue-600 mr-3" />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Информация о модерации постов</h2>
                        <p className="text-gray-600 mt-1">
                            Здесь вы можете управлять постами, проверять их и задавать статусы. Выберите пост для проверки и обновления его статуса.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <h1 className="text-green-800 font-bold text-3xl mb-2">Модерация постов</h1>
            </div>
            <Divider />

            <Table
                dataSource={moderatorStore.postForModerators}
                columns={[
                    {
                        title: "Название",
                        dataIndex: "name",
                        key: "name",
                    },
                    {
                        title: "Автор",
                        dataIndex: ["user", "first_name"],
                        key: "user",
                        render: (_, record) => `${record.user.first_name} ${record.user.second_name}`,
                    },
                    {
                        title: "Дата создания",
                        dataIndex: "created_at",
                        key: "created_at",
                        render: (value) => new Date(value).toLocaleDateString(),
                    },
                    {
                        title: "Действие",
                        key: "action",
                        render: (_, record) => (
                            <Button type="primary" onClick={() => handlePostSelect(record)}>
                                Проверить
                            </Button>
                        ),
                    },
                ]}
                rowKey={(record) => record.id}
            />

            <ManagePostModal
                selectedPost={selectedPost}
                setSelectedPost={setSelectedPost}
                comment={comment}
                handleCommentChange={handleCommentChange}
                status={status}
                handleStatusChange={handleStatusChange}
                handleSubmit={handleSubmit}
                form={form}
            />
        </div>
    );
};

export default observer(ManagePostPage);
