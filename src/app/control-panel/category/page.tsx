"use client"
import { observer } from "mobx-react";
import { Button, Divider, Empty, Form, Input, Modal, Table, TableColumnsType, Tooltip } from "antd";
import React, { useEffect } from "react";
import { useMobxStores } from "@/stores/stores";
import { NomenclatureItem } from "@/stores/NomenclatureStore";
import Image from "next/image";
import { EditOutlined, DeleteOutlined, PlusCircleOutlined, MoreOutlined } from '@ant-design/icons';

const CategoryPage = () => {
    const { nomenclatureStore } = useMobxStores();
    const [form] = Form.useForm();

    const columns: TableColumnsType<NomenclatureItem> = [
        {
            title: "Заголовок",
            dataIndex: "name",
            // render: (value, record) =>
            //     <Input
            //         variant="borderless"
            //         placeholder="Введите название категории..."
            //         onBlur={(event) => nomenclatureStore.handleChangeCategoryName(event.target.value, record)}
            //         defaultValue={value}
            //     />
        },
        {
            title: "Действия",
            width: "20%",
            render: (_: any, record) => (
                <div className="flex justify-end gap-2">
                    <Tooltip title="Редактировать категорию">
                        <Button
                            icon={<EditOutlined />}
                        // onClick={() => nomenclatureStore.setEditCategoryModal(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Удалить категорию">
                        <Button
                            onClick={() => nomenclatureStore.isPossibleDeleteCategory(record.id)}
                            danger type="primary"
                            icon={<DeleteOutlined />}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    useEffect(() => {
        nomenclatureStore.getCategories();
    }, []);

    return (
        <>
            <Modal
                title="Подтверждение удаления"
                open={nomenclatureStore.preDeleteCategoryModal}
                onCancel={() => nomenclatureStore.setPreDeleteCategoryModal(false)}
                cancelText="Отменить"
                okText="Удалить"
                centered
                footer={[
                    <Button key="cancel" onClick={() => nomenclatureStore.setPreDeleteCategoryModal(false)}>
                        Отменить
                    </Button>,
                    <Button
                        key="delete"
                        type="primary"
                        danger
                        onClick={() => {
                            // Логика для удаления категории
                        }}
                    >
                        Удалить
                    </Button>,
                ]}
            >
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h2 className="text-lg font-bold mb-2">Курсы, использующие категорию</h2>
                        {nomenclatureStore.preDeleteCourseList.length > 0 ? (
                            <ul className="ml-4 list-disc pl-4 mb-4">
                                {nomenclatureStore.preDeleteCourseList.map((course) => (
                                    <li key={course.id} className="mb-2">
                                        <span className="font-bold">{course.name}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Empty description="Нет связанных курсов" />
                        )}
                    </div>
                    <div className="ml-4">
                        <Image src="/static/warning_icon.svg" alt="Предупреждение" width={80} height={80} />
                    </div>
                </div>
                <h1 className="text-lg text-gray-700 mt-4">Вы уверены, что хотите удалить категорию?</h1>
            </Modal>


            <Modal
                open={nomenclatureStore.createCategoryModal}
                onCancel={() => nomenclatureStore.setCreateCategoryModal(false)}
                title={"Добавление категории"}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={() => nomenclatureStore.createCategory(form.getFieldsValue()).finally(() => {
                        form.resetFields();
                    })}
                >
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: "Название категории обязательно!" }]}
                    >
                        <Input placeholder="Название категории" />
                    </Form.Item>

                    <div className="flex items-center justify-end">
                        <Form.Item>
                            <Button type="default" onClick={() => nomenclatureStore.setCreateCategoryModal(false)}>
                                Отменить
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="ml-2">Добавить</Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

            <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
                <div className="flex items-center justify-between">
                    <h1 className="text-gray-800 font-bold text-3xl">Доступные категории</h1>
                    <div>
                        <Button
                            className="flex items-center justify-center transition-transform transform hover:scale-105"
                            type="primary"
                            icon={<PlusCircleOutlined />}
                            onClick={() => nomenclatureStore.setCreateCategoryModal(true)}
                        >
                            Добавить категорию
                        </Button>
                        <Button className="ml-2" icon={<MoreOutlined />} />
                    </div>
                </div>
                <Divider />
                <Table
                    rowKey={(record) => record.id}
                    rowSelection={{ type: "checkbox" }}
                    dataSource={nomenclatureStore.categories}
                    columns={columns}
                    loading={nomenclatureStore.loadingCategories}
                    locale={{
                        emptyText: (
                            <Empty
                                description="Нет категорий"
                                imageStyle={{ height: 60 }}
                            />
                        ),
                    }}
                />
            </div>
        </>
    );
}

export default observer(CategoryPage);
