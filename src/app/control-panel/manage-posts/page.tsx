"use client";
import { observer } from "mobx-react";
import { Button, Divider, Input, Table, Modal, Form, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useMobxStores } from "@/stores/stores";
import { Post } from "@/stores/PostStore";
import { PostStatusEnum } from "@/shared/api/posts/model";

const ManagePostModal = ({
    selectedPost,
    setSelectedPost,
    comment,
    handleCommentChange,
    handleStatusChange,
    handleSubmit,
    form,
    fieldComments,
    handleFieldCommentChange
}) => {
    return (
        <Modal
            title={
                <div className="flex items-center">
                    <InfoCircleOutlined className="mr-2 text-blue-500" />
                    <span>Проверка поста: {selectedPost?.name}</span>
                </div>
            }
            open={!!selectedPost}
            onCancel={() => setSelectedPost(null)}
            footer={null}
            width="70%"
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Название" name="name">
                    <Input disabled />
                </Form.Item>

                <Input.TextArea
                    title="Комментарий для Названия"
                    rows={2}
                    value={fieldComments.name}
                    onChange={(e) => handleFieldCommentChange("name", e.target.value)}
                    placeholder="Введите комментарий"
                />

                <Form.Item label="Описание" name="description">
                    <Input.TextArea rows={3} disabled />
                </Form.Item>

                <Input.TextArea
                    title="Комментарий для Описания"
                    rows={2}
                    value={fieldComments.description}
                    onChange={(e) => handleFieldCommentChange("description", e.target.value)}
                    placeholder="Введите комментарий"
                />

                <Form.Item label="Контент" name="content">
                    <Input.TextArea rows={6} disabled />
                </Form.Item>

                <Input.TextArea
                    title="Комментарий для Контента"
                    rows={2}
                    value={fieldComments.content}
                    onChange={(e) => handleFieldCommentChange("content", e.target.value)}
                    placeholder="Введите комментарий"
                />

                <Form.Item label="Общий комментарий для автора">
                    <Input.TextArea
                        rows={4}
                        value={comment}
                        onChange={handleCommentChange}
                        placeholder="Введите комментарий, если есть замечания"
                    />
                </Form.Item>

                <Form.Item label="Статус">
                    <Select onChange={handleStatusChange}>
                        <Select.Option value={PostStatusEnum.APPROVED}>Approved</Select.Option>
                        <Select.Option value={PostStatusEnum.REJECT}>Rejected</Select.Option>
                    </Select>
                </Form.Item>

                <Divider />

                <div className="flex justify-end gap-4">
                    <Button onClick={() => setSelectedPost(null)}>Отменить</Button>
                    <Button type="primary" onClick={handleSubmit}>
                        Отправить
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export interface Comments {
    name: string,
    description: string,
    content: string
}

const ManagePostPage = () => {
    const { moderatorStore } = useMobxStores();

    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [comment, setComment] = useState<string>("");
    const [status, setStatus] = useState<PostStatusEnum | null>(null);
    const [fieldComments, setFieldComments] = useState<Comments>({
        name: "",
        description: "",
        content: "",
    });
    const [form] = Form.useForm();

    useEffect(() => {
        moderatorStore.getPostForModerators();
    }, [moderatorStore]);

    const handlePostSelect = (post: Post) => {
        setSelectedPost(post);
        form.setFieldsValue(post);
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    };

    const handleStatusChange = (value: PostStatusEnum) => {
        setStatus(value);
    };

    const handleFieldCommentChange = (field: string, value: string) => {
        setFieldComments((prevComments) => ({ ...prevComments, [field]: value }));
    };

    const handleSubmit = () => {
        if (!status) {
            message.error("Пожалуйста, выберите статус для поста.");
            return;
        }

        // Отправляем комментарии для всех полей на сервер
        moderatorStore.updatePostStatus(selectedPost!.id, status, comment, fieldComments)
            .then(() => {
                message.success("Статус поста успешно обновлен.");
                setSelectedPost(null); // Закрыть модальное окно
                setComment(""); // Очистить комментарий
                setFieldComments({ name: "", description: "", content: "" }); // Очистить комментарии полей
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
                        dataIndex: "user",
                        key: "user",
                        render: (_, record) => `${record.user.first_name} ${record.user.second_name} ${record.user.last_name}`,
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
                handleStatusChange={handleStatusChange}
                handleSubmit={handleSubmit}
                form={form}
                fieldComments={fieldComments}
                handleFieldCommentChange={handleFieldCommentChange}
            />
        </div>
    );
};

export default observer(ManagePostPage);
