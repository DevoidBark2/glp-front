import React, { FC, useState, useEffect } from "react";
import { Button, Col, Form, FormInstance, Input, Row, Select, Spin, Switch, Upload, message } from "antd";
import { observer } from "mobx-react";
import dynamic from "next/dynamic";
import { InboxOutlined } from "@ant-design/icons";
import Dragger from "antd/lib/upload/Dragger";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import nextConfig from "next.config.mjs";
import { useMobxStores } from "@/shared/store/RootStore";
import { LEVEL_COURSE } from "@/shared/constants";
import { Course, StatusCourseEnum, statusLabels } from "@/shared/api/course/model";

// Динамически загружаем компонент Editor из react-draft-wysiwyg
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false });

interface CourseDetailsMainProps {
    form: FormInstance<Course>;
}

export const CourseDetailsMain: FC<CourseDetailsMainProps> = observer(({ form }) => {
    const { courseStore, nomenclatureStore } = useMobxStores();
    const [accessRight, setAccessRight] = useState(0);
    const [previewImage, setPreviewImage] = useState<string | null>(form.getFieldValue("image") || null);

    useEffect(() => {
        if (form.getFieldValue("image")) {
            setPreviewImage(`${nextConfig.env?.API_URL}${form.getFieldValue("image")}`);
        }
    }, [form.getFieldValue("image")]);

    const uploadProps = {
        name: 'file',
        multiple: false,
        beforeUpload: (file: File) => {
            const isImage = file.type.startsWith("image/");
            if (!isImage) {
                message.error("Можно загружать только изображения (JPEG, PNG, GIF, WebP).");
                return Upload.LIST_IGNORE;
            }
            return isImage;
        },
        onChange(info: any) {
            if (info.file.status === 'done') {
                form.setFieldValue("image", info.file.originFileObj);
                setPreviewImage(URL.createObjectURL(info.file.originFileObj));
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} ошибка загрузки.`);
            }
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={(values) => courseStore.changeCourse(values).then(() => {
                courseStore.setCoursePageTitle(values.name);
            })}
        >
            {!courseStore.loadingCourseDetails ? (<>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item name="id" hidden />
                        <Form.Item
                            name="name"
                            label="Название курса"
                            rules={[{ required: true, message: 'Название курса обязательно!' }]}
                        >
                            <Input placeholder="Введите название курса" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="small_description"
                            label="Краткое описание"
                        >
                            <Input placeholder="Введите краткое описание курса" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="image"
                    label="Картинка"
                >
                    <Dragger {...uploadProps} defaultFileList={form.getFieldValue("image") ? [{
                        uid: Date.now().toString(),
                        name: 'image.png',
                        status: 'done',
                        url: `${nextConfig.env?.API_URL}${form.getFieldValue("image")}`
                    }] : []} listType="picture">
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Нажмите или перенесите файл для загрузки</p>
                    </Dragger>
                </Form.Item>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="category"
                            label="Категория"
                            rules={[{ required: nomenclatureStore.categories.length > 0, message: 'Категория курса обязательно!' }]}
                        >
                            <Select loading={nomenclatureStore.loadingCategories} placeholder="Выберите категорию">
                                {nomenclatureStore.categories.map((category) => (
                                    <Select.Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="access_right"
                            label="Права доступа"
                            rules={[{ required: true, message: 'Права доступа курса обязательно!' }]}
                        >
                            <Select onChange={(value: number) => courseStore.setAccessRight(value)}>
                                <Select.Option value={0}>Открытый</Select.Option>
                                <Select.Option value={1}>Закрытый</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                {courseStore.accessRight === 1 && (
                    <Form.Item
                        name="secret_key"
                        label="Код доступа"
                        rules={[{ required: true, message: "Код доступа обязателен!" }]}
                    >
                        <Input.OTP itemType="number" length={8} />
                    </Form.Item>
                )}

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="duration"
                            label="Время прохождения"
                            rules={[{ required: true, message: "Время прохождения курса обязательно!" }]}
                        >
                            <Input placeholder="Введите время прохождения" type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="level"
                            label="Уровень сложности"
                            rules={[{ required: true, message: "Уровень сложности курса обязательно!" }]}
                        >
                            <Select>
                                {LEVEL_COURSE.map(level => (
                                    <Select.Option key={level.id} value={level.id}>
                                        {level.title}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item name="has_certificate" label="Курс с сертификатом" valuePropName="checked">
                            <Switch checkedChildren="Да" unCheckedChildren="Нет" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="status"
                            label="Статус курса"
                            rules={[{ required: true, message: "Пожалуйста, выберите статус курса!" }]}
                        >
                            <Select>
                                {Object.entries(StatusCourseEnum).map(([key, value]) => (
                                    <Select.Option key={value} value={value}>
                                        {statusLabels[value as StatusCourseEnum]}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="content_description" label="Содержание курса">
                    {/* Используем динамическую загрузку для компонента Editor */}
                    {typeof window !== 'undefined' && <Editor />}
                </Form.Item>

                <div className="flex flex-col items-center">
                    <Form.Item style={{ marginTop: '10px' }}>
                        <Button type="primary" htmlType="submit" loading={courseStore.loadingCreateCourse}>
                            Редактировать
                        </Button>
                    </Form.Item>
                </div>
            </>) : (<Spin />)}
        </Form>
    );
});
