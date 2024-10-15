"use client"
import React, { useState } from "react";
import { Form, Input, Select, Button, InputNumber, message, Divider, Breadcrumb, Upload } from "antd";
import { conditionForAchievements, typesConsitions } from "@/constants";
import Link from "next/link";
import { observer } from "mobx-react";
import { useMobxStores } from "@/stores/stores";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image"

const AchievementsPage = () => {
    const [form] = Form.useForm();
    const {achievementsStore} = useMobxStores();

    const [uploadedLogo, setUploadedLogo] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null);

    return (
        <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
            <div className="flex items-center justify-between">
            <div className="flex items-center justify-between">
                    <Breadcrumb items={[ {
                        title: <Link href={"/control-panel/achievements"}>Доступные достижения</Link>,
                    },{
                        title: "Новое достижение",
                    }]}/>
                </div>
                <h1 className="text-gray-800 font-bold text-3xl mb-2">Создание достижения</h1>
                <div></div>
            </div>
            <Divider />
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => achievementsStore.createAchievements(values).then((response) => {
                    message.success('Достижение успешно создано!');
                    form.resetFields();
                })}
            >
                <Form.Item
                    name="title"
                    label="Название Достижения"
                    rules={[{ required: true, message: 'Введите название достижения' }]}
                >
                    <Input placeholder="Например, Мастер курса" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Описание"
                >
                    <Input.TextArea placeholder="Краткое описание достижения" rows={4} />
                </Form.Item>

                <Form.Item 
                    label="Иконка достижения"
                    name="logo_url"
                    rules={[{ required: true, message: 'Загрузите инонку достижения' }]}
                >
                    <Upload
                        name="logo_url"
                        listType="picture-card"
                        showUploadList={false}
                        beforeUpload={(file) => {
                            const isImage = file.type.startsWith("image/");
                            if (!isImage) {
                                message.error("Можно загрузить только изображения.");
                                return Upload.LIST_IGNORE;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                                const imageUrl = reader.result as string;
                                setUploadedLogo(imageUrl);
                            };
                            reader.readAsDataURL(file);

                            setFile(file); // сохраняем файл в состоянии для отправки
                            return false;
                        }}
                    >
                        {uploadedLogo ? (
                            <Image
                                src={uploadedLogo}
                                alt="Логотип"
                                width={200}
                                height={200}
                            />
                        ) : (
                            <div>
                                <UploadOutlined /> Загрузить иконку
                            </div>
                        )}
                    </Upload>
                </Form.Item>
                <Form.Item
                    name="condition"
                    label="Условия"
                    rules={[{ required: true, message: 'Выберите условие достижения' }]}
                >
                    <Select placeholder="Выберите условие достижения">
                        {typesConsitions.map(type => (
                            <Select.OptGroup key={type} label={type}>
                                {conditionForAchievements
                                    .filter(condition => condition.type === type)
                                    .map(condition => (
                                        <Select.Option key={condition.id} value={condition.condition}>
                                            {condition.title}
                                        </Select.Option>
                                    ))}
                            </Select.OptGroup>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="targetValue"
                    label="Целевое значение"
                    rules={[{ required: true, message: 'Укажите целевое значение для достижения' }]}
                >
                    <InputNumber min={1} placeholder="Например, 5 курсов" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={achievementsStore.createLoading}>
                        Создать достижение
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default observer(AchievementsPage);
