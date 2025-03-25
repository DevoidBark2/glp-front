"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { observer } from "mobx-react";
import {Breadcrumb, Button, Col, Divider, Form, Input, notification, Row, Upload, UploadFile} from "antd";
const Editor = dynamic(
    () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
    { ssr: false }
);
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { InboxOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { PostCreateForm } from "@/shared/api/posts/model";
import { PageContainerControlPanel } from "@/shared/ui";
import { useMobxStores } from "@/shared/store/RootStore";

const CreatePostPage = () => {
    const { postStore } = useMobxStores();
    const [form] = Form.useForm<PostCreateForm>();
    const router = useRouter();

    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const handleEditorChange = (state:any) => {
        setEditorState(state);
    };

    const getContentAsHTML = () => {
        const content = convertToRaw(editorState.getCurrentContent());
        const isEmpty = !content.blocks.some(block => block.text.trim() !== "");
        return isEmpty ? "" : JSON.stringify(content);
    };

    const props = {
        name: "file",
        multiple: false,
        onChange(info: any) {
            const { file, fileList } = info;
            const { status } = file;

            if (status === "done") {
                notification.success({ message: `${file.name} загружен успешно.` });
                form.setFieldValue("image", fileList[0].originFileObj);
            } else if (status === "removed") {
                form.setFieldValue("image", null);
                notification.success({ message: `${file.name} удален.` });
            } else if (status === "error") {
                notification.error({ message: `${file.name} ошибка загрузки.` });
            }
        },
        beforeUpload: () => true,
    };

    return (
        <PageContainerControlPanel>
            <Breadcrumb
                items={[
                    { title: <Link href={"/control-panel/posts"}>Доступные посты</Link> },
                    { title: "Новый пост" },
                ]}
            />
            <div className="flex justify-center items-center">
                <h1 className="text-center text-3xl">Добавление поста</h1>
            </div>
            <Divider />
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) =>{
                    if(!getContentAsHTML()) {
                        form.setFields([
                            { name: "content", errors: ["Пожалуйста, введите содержание!"] },
                        ]);
                        return;
                    }
                    postStore.createPost({ ...values, content: getContentAsHTML() }).then(() => {
                        router.push("/control-panel/posts");
                    })
                }}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Заголовок"
                            rules={[
                                { required: true, message: "Введите заголовок поста!" },
                                { max: 100, message: "Заголовок не должен превышать 100 символов!" },
                            ]}
                        >
                            <Input placeholder="Введите название поста" maxLength={100} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="description"
                            label="Описание"
                            rules={[{ max: 255, message: "Описание не должно превышать 255 символов!" }]}
                        >
                            <Input placeholder="Введите описание поста" maxLength={255} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="image" label="Изображение поста">
                    <Upload.Dragger {...props} listType="picture">
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Нажмите или перетащите файл в эту область для загрузки
                        </p>
                        <p className="ant-upload-hint">
                            Запрещено загружать конфиденциальные данные.
                        </p>
                    </Upload.Dragger>
                </Form.Item>

                <Form.Item
                    name="content"
                    label="Контент поста"
                    rules={[{required: true,message: "Пожалуйста, введите содержание!"}]}
                >
                    <div className="border p-3 rounded-md shadow-md">
                        <Editor
                            editorState={editorState}
                            onEditorStateChange={handleEditorChange}
                        />
                    </div>
                </Form.Item>

                <div className="flex flex-col items-center">
                    <Form.Item style={{ marginTop: "10px" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={postStore.loading}
                        >
                            Создать
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </PageContainerControlPanel>
    );
};

export default observer(CreatePostPage);
