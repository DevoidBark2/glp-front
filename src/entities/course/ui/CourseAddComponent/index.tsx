import { Button, Col, Form, message, Row, Select, Switch, Upload, UploadProps, Image } from "antd";
import { Input } from "antd/lib";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { observer } from "mobx-react";
import {convertToRaw, EditorState} from "draft-js";

import { useMobxStores } from "@/shared/store/RootStore";
import { LEVEL_COURSE } from "@/shared/constants";
import { Course } from "@/shared/api/course/model";

const Editor = dynamic(
    () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
    { ssr: false }
);

export const CourseAddComponent = observer(() => {
    const { courseStore, nomenclatureStore } = useMobxStores();
    const [code, setCode] = useState('');
    const [accessRight, setAccessRight] = useState(0);
    const [createCourseForm] = Form.useForm<Course>();
    const router = useRouter();


    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error("Можно загружать только изображения (JPEG, PNG, GIF, WebP).");
                return Upload.LIST_IGNORE;
            }
            return true;
        },
        onChange(info: any) {
            const { status } = info.file;
            if (status === 'done') {
                const url = URL.createObjectURL(info.file.originFileObj);
                setImageUrl(url);
                createCourseForm.setFieldValue("image", info.file);
            } else if (status === 'error') {
                message.error(`${info.file.name} ошибка загрузки.`);
            }
        },
        onRemove() {
            setImageUrl(null)
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const getContentAsHTML = () => {
        const content = convertToRaw(editorState.getCurrentContent());
        return JSON.stringify(content);
    };


    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const handleEditorChange = (state) => {
        setEditorState(state);
    };



    return (
        <>
            <Form
                form={createCourseForm}
                onFinish={(values) => courseStore.createCourse({...values, content_description:  getContentAsHTML()}).then(() => {
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

                {imageUrl && <Image src={imageUrl} alt="Preview" width={100} height={100} />}

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
                    <div className="border p-3 rounded-md shadow-md">
                        <Editor
                            editorState={editorState}
                            onEditorStateChange={handleEditorChange}
                        />
                    </div>
                </Form.Item>

                <div className="flex flex-col items-center">
                    <Form.Item style={{marginTop: '10px'}}>
                        <Button color="default" variant="solid" htmlType="submit"
                                loading={courseStore.loadingCreateCourse}>Создать</Button>
                    </Form.Item>
                </div>
            </Form>
        </>
    )
})