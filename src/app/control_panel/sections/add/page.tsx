"use client";
import {
    Breadcrumb,
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    message,
    Row,
    Select,
    Steps,
    Upload,
    UploadProps,
    Switch,
    Modal,
    Divider,
    Tooltip, Radio, List,
} from "antd";
import { useMobxStores } from "@/stores/stores";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Course } from "@/stores/CourseStore";
import { InboxOutlined, EyeOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";

const SectionAddPage = () => {
    const { courseStore } = useMobxStores();
    const [createSectionForm] = Form.useForm();
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [current, setCurrent] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const router = useRouter();

    const steps = [
        {
            title: "Выбор курса",
            content: (
                <Form.Item
                    name="course"
                    label="Курс"
                    rules={[{ required: true, message: "Выберите курс" }]}
                >
                    <List
                        grid={{ gutter: 16, column: 4 }}
                        dataSource={courseStore.teacherCourses}
                        renderItem={(item) => (
                            <List.Item>
                                <Card
                                    key={item.id}
                                    title={item.name}
                                    hoverable
                                    style={{ width: 240, margin: 8 }}
                                >
                                    <Card.Meta
                                        title={item.name}
                                        description={item.description}
                                        style={{ textAlign: 'left' }}
                                    />
                                </Card>
                            </List.Item>
                        )}
                        itemLayout="vertical"
                        onChange={(selected) => {
                            console.log(selected)
                            createSectionForm.setFieldsValue({ course: selected });
                        }}
                    />
                </Form.Item>
            ),
        },
        {
            title: "Информация о секции",
            content: (
                <>
                    <Form.Item
                        name="sectionName"
                        label="Название секции"
                        rules={[{ required: true, message: "Введите название секции" }]}
                    >
                        <Input placeholder="Введите название секции..." />
                    </Form.Item>
                    <Form.Item
                        name="sectionDescription"
                        label="Описание секции"
                        rules={[{ required: true, message: "Введите описание секции" }]}
                    >
                        <TextArea
                            placeholder="Введите описание секции..."
                            autoSize={{ minRows: 3, maxRows: 6 }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="publishDate"
                        label="Дата публикации"
                        rules={[{ required: true, message: "Выберите дату публикации" }]}
                    >
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                    </Form.Item>
                    <Form.Item
                        name="accessLevel"
                        label="Доступность"
                        rules={[{ required: true, message: "Выберите уровень доступа" }]}
                    >
                        <Select placeholder="Выберите уровень доступа">
                            <Select.Option value="public">Открытый</Select.Option>
                            <Select.Option value="private">Закрытый (только подписчики)</Select.Option>
                        </Select>
                    </Form.Item>
                </>
            ),
        },
        {
            title: "Мультимедиа",
            content: (
                <>
                    <Form.Item
                        name="upload"
                        label="Загрузка файлов"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
                    >
                        <Upload.Dragger name="files" action="/upload.do">
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Нажмите или перетащите файл в эту область</p>
                            <p className="ant-upload-hint">Поддерживаются любые файлы</p>
                        </Upload.Dragger>
                    </Form.Item>
                    <Form.Item
                        name="multimediaLinks"
                        label="Ссылки на мультимедиа"
                    >
                        <Input placeholder="Введите ссылки на видео или изображения..." />
                    </Form.Item>
                </>
            ),
        },
        {
            title: "Предпросмотр",
            content: (
                <>
                    <Button type="primary" onClick={() => setIsModalVisible(true)}>
                        Предварительный просмотр
                    </Button>
                    <Modal
                        title="Предварительный просмотр секции"
                        visible={isModalVisible}
                        onOk={() => setIsModalVisible(false)}
                        onCancel={() => setIsModalVisible(false)}
                        footer={[
                            <Button key="back" onClick={() => setIsModalVisible(false)}>
                                Закрыть
                            </Button>,
                            <Button key="submit" type="primary" onClick={() => setIsModalVisible(false)}>
                                Подтвердить
                            </Button>,
                        ]}
                    >
                        <Divider>Название секции</Divider>
                        <p>{createSectionForm.getFieldValue("sectionName")}</p>
                        <Divider>Описание секции</Divider>
                        <p>{createSectionForm.getFieldValue("sectionDescription")}</p>
                        <Divider>Дата публикации</Divider>
                        <p>{createSectionForm.getFieldValue("publishDate")?.format("YYYY-MM-DD HH:mm:ss")}</p>
                        <Divider>Уровень доступа</Divider>
                        <p>{createSectionForm.getFieldValue("accessLevel")}</p>
                        <Divider>Загруженные файлы и ссылки</Divider>
                        <p>{createSectionForm.getFieldValue("multimediaLinks")}</p>
                    </Modal>
                </>
            ),
        },
    ];

    const next = () => setCurrent(current + 1);
    const prev = () => setCurrent(current - 1);

    const onFinish = (values: any) => {
        message.success("Секция успешно добавлена!");
        // Логика отправки данных на сервер
        router.push("/control_panel/sections");
    };

    useEffect(() => {
        courseStore.getCoursesForCreator();
    }, []);

    return (
        <div className="bg-white h-full p-5 overflow-y-auto">
            <Breadcrumb
                items={[
                    {
                        title: <Link href="/control_panel/sections">Разделы</Link>,
                    },
                    {
                        title: <span>Новый раздел</span>,
                    },
                ]}
            />
            <h1 className="text-center text-3xl mb-5">Добавление нового раздела</h1>
            <Form form={createSectionForm} onFinish={onFinish} layout="vertical">
                <Steps current={current}>
                    {steps.map((item) => (
                        <Steps.Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <div className="steps-content mt-5">{steps[current].content}</div>
                <div className="steps-action mt-5 flex justify-end">
                    {current > 0 && (
                        <Button style={{ marginRight: 8 }} onClick={() => prev()}>
                            Назад
                        </Button>
                    )}
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => next()}>
                            Далее
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" htmlType="submit">
                            Подтвердить и создать
                        </Button>
                    )}
                </div>
            </Form>
        </div>
    );
};

export default observer(SectionAddPage);
