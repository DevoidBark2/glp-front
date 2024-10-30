"use client";
import React, { useState } from "react";
import { observer } from "mobx-react";
import { Collapse, Typography, Row, Col, Card, Button, Modal, Form, Input, Table, Popconfirm, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import PageContainerControlPanel from "@/components/PageContainerControlPanel/PageContainerControlPanel";

const { Panel } = Collapse;
const { Title } = Typography;

const FaqPage = () => {
    const [faqData, setFaqData] = useState([
        { key: "1", question: "Как я могу зарегистрироваться?", answer: "Чтобы зарегистрироваться, нажмите на кнопку регистрации в верхнем правом углу." },
        { key: "2", question: "Как восстановить пароль?", answer: "Для восстановления пароля нажмите на 'Забыли пароль?' и следуйте инструкциям." },
        { key: "3", question: "Как я могу связаться с поддержкой?", answer: "Вы можете связаться с поддержкой по электронной почте support@example.com." },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();

    const openModal = (record = null) => {
        setEditingItem(record);
        setIsModalOpen(true);
        form.setFieldsValue(record || { question: "", answer: "" });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        form.resetFields();
    };

    const handleAddOrUpdate = (values) => {
        if (editingItem) {
            setFaqData((prev) =>
                prev.map((item) => (item.key === editingItem.key ? { ...item, ...values } : item))
            );
        } else {
            setFaqData((prev) => [...prev, { key: Date.now().toString(), ...values }]);
        }
        closeModal();
    };

    const handleDelete = (key) => {
        setFaqData((prev) => prev.filter((item) => item.key !== key));
    };

    const columns = [
        {
            title: "Вопрос",
            dataIndex: "question",
            key: "question",
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: "Ответ",
            dataIndex: "answer",
            key: "answer",
        },
        {
            title: "Действия",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => openModal(record)}>
                        Редактировать
                    </Button>
                    <Popconfirm title="Удалить этот вопрос?" onConfirm={() => handleDelete(record.key)}>
                        <Button icon={<DeleteOutlined />} danger>
                            Удалить
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <PageContainerControlPanel>
            <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
                            Панель управления FAQ
                        </Title>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => openModal()}
                            style={{ marginBottom: 20 }}
                        >
                            Добавить вопрос
                        </Button>
                        <Table
                            dataSource={faqData}
                            columns={columns}
                            pagination={false}
                            expandable={{
                                expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.answer}</p>,
                            }}
                            rowKey="key"
                        />

            <Modal
                title={editingItem ? "Редактировать вопрос" : "Добавить новый вопрос"}
                open={isModalOpen}
                onCancel={closeModal}
                onOk={() => form.submit()}
                okText={editingItem ? "Сохранить" : "Добавить"}
            >
                <Form form={form} layout="vertical" onFinish={handleAddOrUpdate}>
                    <Form.Item
                        name="question"
                        label="Вопрос"
                        rules={[{ required: true, message: "Пожалуйста, введите вопрос" }]}
                    >
                        <Input placeholder="Введите вопрос" />
                    </Form.Item>
                    <Form.Item
                        name="answer"
                        label="Ответ"
                        rules={[{ required: true, message: "Пожалуйста, введите ответ" }]}
                    >
                        <Input.TextArea rows={4} placeholder="Введите ответ" />
                    </Form.Item>
                </Form>
            </Modal>
        </PageContainerControlPanel>
    );
};

export default observer(FaqPage);
