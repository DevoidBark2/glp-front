import { Button, Col, Form, notification, Row, Select, Switch, UploadProps } from "antd";
import { Input } from "antd/lib";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { LEVEL_COURSE } from "@/shared/constants";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import { useMobxStores } from "@/shared/store/RootStore";
import {observer} from "mobx-react";
const ReactQuill = dynamic(
    () => import('react-quill'),
    { ssr: false }
)

export const CourseAddComponent = observer(() => {
    const { courseStore, nomenclatureStore } = useMobxStores();
    const [code, setCode] = useState('');
    const [accessRight, setAccessRight] = useState(0);
    const [createCourseForm] = Form.useForm();
    const router = useRouter();


    const props: UploadProps = {
        name: 'file',
        multiple: true,
        onChange(info: any) {
            const { status } = info.file;
            if (status === 'done') {
                notification.success({ message: `${info.file.name} загружен успешно.` });
                createCourseForm.setFieldValue("image", info.file);
            } else if (status === 'error') {
                notification.error({ message: `${info.file.name} ошибка загрузки.` });
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };


    return (
        <>
            <Form
                form={createCourseForm}
                onFinish={(values) => courseStore.createCourse(values).then((response) => {
                    router.push('/control-panel/courses')
                    courseStore.setSuccessCreateCourseModal(true)
                })}
                layout="vertical"
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item name="id" hidden />
                        <Form.Item
                            name="name"
                            label="Название курса"
                            rules={[{ required: true, message: 'Название курса обязательно!' }]}
                        >
                            <Input placeholder="Введите название курса" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="small_description"
                            label="Краткое описание"
                        >
                            <Input placeholder="Введите краткое описание курса"
                                   style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="image"
                    label="Картинка"
                >
                    <Dragger {...props}>
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
                            rules={[{ required: nomenclatureStore.categories.length > 0, message: "Категория курса обязательно!" }]}
                        >
                            <Select loading={nomenclatureStore.loadingCategories}>
                                {
                                    nomenclatureStore.categories.map(category => (
                                        <Select.Option key={category.id} value={category.id}>{category.name}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="access_right"
                            label="Права доступа"
                            rules={[{ required: true, message: "Права доступа курса обязательно!" }]}
                        >
                            <Select onChange={(value) => setAccessRight(value)}>
                                <Select.Option value={0}>Открытый</Select.Option>
                                <Select.Option value={1}>Закрытый</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                </Row>
                {accessRight === 1 && (
                    <Form.Item
                        layout="vertical"
                        name="secret_key"
                        label="Код доступа"
                        rules={[{ required: true, message: "Код доступа обязателен!" }]}
                    >
                        <Input.OTP length={8} value={code} onChange={(e) => setCode(e)} />
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
                                    <Select.Option key={level.id} value={level.id}>{level.title}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="has_certificate"
                    label="Курс с сертификатом"
                    valuePropName="checked"
                >
                    <Switch
                        checkedChildren="Да"
                        unCheckedChildren="Нет"
                    />
                </Form.Item>

                <Form.Item
                    name="content_description"
                    label="Содержание курса"
                >
                    {typeof window !== 'undefined' && <ReactQuill theme="snow" />}
                </Form.Item>

                <div className="flex flex-col items-center">
                    <Form.Item style={{ marginTop: '10px' }}>
                        <Button type="primary" htmlType="submit" loading={courseStore.loadingCreateCourse}>Создать</Button>
                    </Form.Item>
                </div>
            </Form>
        </>
    )
})