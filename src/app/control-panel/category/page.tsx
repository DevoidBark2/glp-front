"use client"
import {observer} from "mobx-react";
import {Button, Divider, Empty, Form, Input, Modal, Table, TableColumnsType, Tooltip} from "antd";
import React, {useEffect} from "react";
import {useMobxStores} from "@/stores/stores";
import {NomenclatureItem} from "@/stores/NomenclatureStore";
import Image from "next/image";
import {EditOutlined, DeleteOutlined, PlusCircleOutlined, WarningOutlined} from '@ant-design/icons';

const CategoryPage = () => {
    const {nomenclatureStore} = useMobxStores();
    const [form] = Form.useForm();

    const columns: TableColumnsType<NomenclatureItem> = [
        {
            title: "Заголовок",
            dataIndex: "name",
            render: (value, record) =>
                <Input
                    variant="borderless"
                    placeholder="Введите название категории..."
                    onBlur={(event) => nomenclatureStore.handleChangeCategoryName(event.target.value, record)}
                    defaultValue={value}
                />
        },
        {
            title: "Действия",
            width: "20%",
            render: (_: any, record) => (
                <div className="flex items-center justify-start">
                    <Tooltip title="Редактировать">
                        <Button
                            shape="circle"
                            icon={<EditOutlined />}
                            // onClick={() => nomenclatureStore.setEditCategoryModal(record)}
                            style={{ marginRight: '10px' }}
                        />
                    </Tooltip>
                    <Tooltip title="Удалить">
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
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold">Курсы, использующие категорию</h2>
                        {nomenclatureStore.preDeleteCourseList.length > 0 ? <ul className="ml-4 list-disc pl-4 mb-4">
                            {nomenclatureStore.preDeleteCourseList.map((course) => (
                                <li key={course.id} className="mb-2">
                                    <span className="font-bold">{course.name}</span>
                                </li>
                            ))}
                        </ul> : <Empty description="Нет связанных курсов"/>}
                    </div>
                    <Image src="/static/warning_icon.svg" alt="Предупреждение" width={100} height={100}/>
                </div>
                <h1>Вы уверены, что хотите удалить категорию?</h1>
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
                        rules={[{required: true, message: "Название категории обязательно!"}]}
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

            <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto" style={{height: 'calc(100vh - 60px)'}}>
                <div className="bg-white h-full p-5">
                    <div className="flex items-center justify-between">
                        <h1 className="text-green-800 font-bold text-3xl">Доступные категории</h1>
                        <Button
                            type="primary"
                            icon={<PlusCircleOutlined />}
                            onClick={() => nomenclatureStore.setCreateCategoryModal(true)}
                        >
                            Добавить категорию
                        </Button>
                    </div>
                    <Divider />
                    <Table
                        rowKey={(record) => record.id}
                        rowSelection={{type: "checkbox"}}
                        dataSource={nomenclatureStore.categories}
                        columns={columns}
                        loading={nomenclatureStore.loadingCategories}
                        rowClassName={(record, index) => index % 2 === 0 ? "bg-gray-50" : "bg-white"}
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
            </div>
        </>
    );
}

export default observer(CategoryPage);
