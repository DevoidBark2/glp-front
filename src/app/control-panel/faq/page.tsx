"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Button, Modal, Form, Input, Table, Popconfirm, TableColumnsType, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import PageContainerControlPanel from "@/components/PageContainerControlPanel/PageContainerControlPanel";
import { Faq } from "@/shared/api/faq/model";
import { useMobxStores } from "@/shared/store/RootStore";
import PageHeader from "@/components/PageHeader/PageHeader";
import { faqTable } from "@/shared/config/tableConfig";
import { SizeType } from "antd/es/config-provider/SizeContext";

const FaqPage = () => {
    const { faqStore } = useMobxStores();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<Faq | null>(null);
    const [form] = Form.useForm<Faq>();
    const [settings, setSettings] = useState<{
        pagination_size: number,
        table_size: SizeType,
        show_footer_table: boolean
    } | null>(null);

    const openModal = (record?: Faq) => {
        if (record) {
            setEditingItem(record);
        }
        setIsModalOpen(true);
        form.setFieldsValue(record || { question: "", answer: "" });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        form.resetFields();
    };

    const handleAddOrUpdate = (values: Faq) => {
        if (editingItem)
            faqStore.updatedFaq(values);
        else faqStore.create(values);
        closeModal();
    };

    const columns: TableColumnsType<Faq> = [
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
            render: (text) => {
                const maxLength = 50;
                return text.length > maxLength
                    ? `${text.substring(0, maxLength)}...`
                    : text;
            }
        },
        {
            title: "Действия",
            key: "actions",
            render: (_, record) => (
                <div className="flex justify-end gap-2">
                    <Tooltip title="Редактировать">
                        <Button type="default" icon={<EditOutlined />} onClick={() => openModal(record)} />
                    </Tooltip>
                    <Tooltip title="Удалить">
                        <Popconfirm
                            title="Удалить этот вопрос?"
                            onConfirm={() => faqStore.delete(record.id)}
                            placement="leftBottom"
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button danger type="primary" icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </div>
            ),
        },
    ];

    useEffect(() => {
        const settingUser = JSON.parse(window.localStorage.getItem('user_settings')!);
        setSettings(settingUser);
        faqStore.getAll();
    }, [])

    return (
        <PageContainerControlPanel>
            <PageHeader
                title="Вопросы и ответы"
                buttonTitle="Добавить FAQ"
                onClickButton={openModal}
                showBottomDivider
            />
            <Table
                size={(settings && settings.table_size) ?? "middle"}
                footer={settings && settings.show_footer_table ? (table) => <div>Общее количество: {table.length}</div> : undefined}
                pagination={{ pageSize: Number((settings && settings.pagination_size) ?? 5) }}
                rowKey={(record) => record.id}
                loading={faqStore.loading}
                dataSource={faqStore.faqs}
                columns={columns}
                expandable={{
                    expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.answer}</p>,
                }}
                locale={faqTable}
            />

            <Modal
                title={editingItem ? "Редактировать вопрос" : "Добавить новый вопрос"}
                open={isModalOpen}
                onCancel={closeModal}
                onOk={() => form.submit()}
                okText={editingItem ? "Сохранить" : "Добавить"}
            >
                <Form form={form} layout="vertical" onFinish={handleAddOrUpdate}>
                    <Form.Item name="id" hidden></Form.Item>
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
