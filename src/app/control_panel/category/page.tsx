"use client"
import {observer} from "mobx-react";
import {Button, Divider, Empty, Form, Input, Modal, Table, TableColumnsType} from "antd";
import React, {useEffect} from "react";
import {useMobxStores} from "@/stores/stores";
import {NomenclatureItem} from "@/stores/NomenclatureStore";
import Image from "next/image";

const CategoryPage = () => {
    const {nomenclatureStore} = useMobxStores();
    const [form] = Form.useForm();
    const columns: TableColumnsType<NomenclatureItem> = [
        {
            title: "Заголовок",
            dataIndex: "name",
            render: (_, record) =>
                <Input
                    variant="borderless"
                    placeholder="Введите название категории..."
                    onBlur={(event) => nomenclatureStore.handleChangeCategoryName(event.target.value,record)}
                    defaultValue={record.name}
                />
        },
        {
            title: "Действия",
            width:"20%",
            render: (_:any, record) => (
                <div>
                    <Button
                        onClick={() => nomenclatureStore.isPossibleDeleteCategory(record.id)}
                        danger type="primary" style={{marginLeft:'20px'}} >
                        Удалить
                    </Button>
                </div>
            ),
        },
    ]

    useEffect(() => {
        nomenclatureStore.getCategories()
    }, []);

    return <>
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
                    {nomenclatureStore.preDeleteCourseList.length > 0 ? <ul className=" ml-4 list-disc pl-4 mb-4">
                        {nomenclatureStore.preDeleteCourseList.map((course) => (
                            <li key={course.id} className="mb-2">
                                <span className="font-bold">{course.name}</span>
                            </li>
                        ))}
                    </ul> : <Empty description=""/>}
                </div>
                <Image src="/static/warning_icon.svg" alt="Предупреждение" width={100} height={100}/>
            </div>
            <h1>Вы уверены,что хотите удалить категорию?</h1>
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
                    form.resetFields()
                })}
            >
                <Form.Item
                    name="name"
                    rules={[{required: true, message: "Название категории обязательно!"}]}
                >
                    <Input placeholder="Название категории"/>
                </Form.Item>

                <div className="flex items-center justify-end">
                    <Form.Item>
                        <Button type="default" onClick={() => nomenclatureStore.setCreateCategoryModal(false)} >
                            Отменить
                        </Button>
                    </Form.Item>
                    <Form.Item><Button type="primary" htmlType="submit" className="ml-2">Добавить</Button></Form.Item>
                </div>
            </Form>
        </Modal>
        <div className="bg-white h-full p-5">
            <div className="bg-white h-full p-5">
                <div className="flex items-center justify-between">
                    <h1 className="text-green-800 font-bold text-3xl mb-2">Доступные категории</h1>
                    <div>
                        <Button onClick={() => nomenclatureStore.setCreateCategoryModal(true)} type="primary">Добавить
                            категорию</Button>
                    </div>
                </div>
                <Divider/>
                <Table dataSource={nomenclatureStore.categories} columns={columns}
                       loading={nomenclatureStore.loadingCategories}/>
            </div>
        </div>
    </>
}

export default observer(CategoryPage)