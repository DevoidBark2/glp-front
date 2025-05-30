"use client"
import { Breadcrumb, Button, Divider, Form, Input, notification, Select, Tag, Upload, UploadProps } from "antd";
import { observer } from "mobx-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
    ClockCircleOutlined,
    InboxOutlined,
    SyncOutlined,
} from "@ant-design/icons";
const Editor = dynamic(
    () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
    { ssr: false }
);
import dynamic from "next/dynamic";
import {EditorState} from "draft-js";

import { PageContainerControlPanel } from "@/shared/ui";
import { useMobxStores } from "@/shared/store/RootStore";
import nextConfig from "next.config.mjs";
import { Post, PostStatusEnum } from "@/shared/api/posts/model";

const PostPage = () => {
    const { postStore } = useMobxStores();
    const { postId } = useParams();
    const router = useRouter();

    const [form] = Form.useForm<Post>();

    const [currentPost, setCurrentPost] = useState<Post | null>(null);
    const [fileList, setFileList] = useState<any[]>([]);


    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const handleEditorChange = (state:any) => {
        setEditorState(state);
    };


    const props: UploadProps = {
        name: 'file',
        multiple: false,
        fileList,
        listType: "picture",
        onChange(info:any) {
            const { status } = info.file;

            setFileList(info.fileList);

            if (status === 'done') {
                notification.success({
                    message: `${info.file.name} загружен успешно.`,
                });

                form.setFieldValue('image', `${nextConfig.env?.API_URL}${info.file.response?.url}`);
            } else if (status === 'error') {
                notification.error({
                    message: `${info.file.name} ошибка загрузки.`,
                });
            }
        },
        onRemove() {
            setFileList([]);
            form.setFieldValue('image', null);
        },
    };


    useEffect(() => {
        postStore.getPostById(Number(postId)).then(response => {
            setCurrentPost(response!)
            form.setFieldsValue(response!)

            if (response?.image) {
                setFileList([
                    {
                        uid: '-1', // Уникальный идентификатор файла
                        name: response?.image.split('/')[1],
                        status: 'done', // Статус успешной загрузки
                        url: `${nextConfig.env?.API_URL}${response.image}`,
                    },
                ]);
            }
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        });
    }, [postId]);

    return (
        <PageContainerControlPanel>
            <Breadcrumb
                items={[
                    {
                        title: <Link href={"/control-panel/posts"}>Доступные посты</Link>,
                    },
                    {
                        title: currentPost?.name,
                    },
                ]}
            />
            <div className="flex justify-center items-center">
                <h1 className="text-center text-3xl">Изменение поста</h1>
            </div>
            <Divider />
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => postStore.changePost(values).then(() => {
                    router.push('/control-panel/posts')
                })}
            >
                <Form.Item name="id" hidden></Form.Item>
                <Form.Item
                    name="name"
                    label="Заголовок"
                    rules={[{ required: true, message: 'Введите заголовок поста!' }]}
                >
                    <Input placeholder="Введите название поста" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Описание"
                    rules={[{ required: true, message: 'Введите описание поста!' }]}
                >
                    <Input placeholder="Введите описание поста" />
                </Form.Item>

                <Form.Item name="image" label="Изображение поста">
                    <Upload.Dragger {...props}>
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
                    label="Статус"
                    name="status"
                >
                    <Select
                        placeholder="Выберите статус"
                        style={{ width: '100%' }}

                    >
                        <Select.Option value={PostStatusEnum.APPROVED}>
                            <Tag icon={<ClockCircleOutlined />} color="green">
                                Подтвержденный
                            </Tag>
                        </Select.Option>
                        <Select.Option value={PostStatusEnum.NEW}>
                            <Tag icon={<ClockCircleOutlined />} color="blue">
                                Новый
                            </Tag>
                        </Select.Option>
                        <Select.Option value={PostStatusEnum.REJECT}>
                            <Tag color="red">Отклонен</Tag>
                        </Select.Option>

                        <Select.Option value={PostStatusEnum.IN_PROCESSING}>
                            <Tag icon={<SyncOutlined spin />} color="yellow">
                                В обработке
                            </Tag>
                        </Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="content"
                    label="Контент поста"
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
                        <Button type="primary" htmlType="submit" loading={postStore.loading}>Изменить</Button>
                    </Form.Item>
                </div>
            </Form>
        </PageContainerControlPanel>
    )
}

export default observer(PostPage);