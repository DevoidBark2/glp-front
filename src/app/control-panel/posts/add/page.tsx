"use client"
import {PageContainerControlPanel} from "@/shared/ui";
import { observer } from "mobx-react";
import { Breadcrumb, Button, Divider, Form, Input, notification, UploadProps } from "antd";
import dynamic from "next/dynamic";
import { InboxOutlined } from "@ant-design/icons";

import Dragger from "antd/es/upload/Dragger";
import { useEffect, useState } from "react";
import { PostCreateForm, PostStatusEnum } from "@/shared/api/posts/model";
import { useMobxStores } from "@/stores/stores";
import { getCookieUserDetails } from "@/lib/users";
import Link from "next/link";
import { useRouter } from "next/navigation";
const ReactQuill = dynamic(
    () => import('react-quill'),
    { ssr: false }
)
import 'react-quill/dist/quill.snow.css';


const CreatePostPage = () => {
    const { postStore } = useMobxStores();
    const [form] = Form.useForm<PostCreateForm>();
    const [currentUser, setCurrentUser] = useState(null);
    const router = useRouter();
    const props: UploadProps = {
        name: 'file',
        multiple: false,
        onChange(info: any) {
            const { status } = info.file;
            if (status === 'done') {
                notification.success({ message: `${info.file.name} загружен успешно.` });
                form.setFieldValue("image", info.file);
            } else if (status === 'error') {
                notification.error({ message: `${info.file.name} ошибка загрузки.` });
            }
        }
    };

    useEffect(() => {
        const user = getCookieUserDetails();
        setCurrentUser(user);
    }, [])


    return (
        <PageContainerControlPanel>
            <Breadcrumb
                items={[
                    {
                        title: <Link href={"/control-panel/posts"}>Доступные посты</Link>,
                    },
                    {
                        title: 'Новый пост',
                    },
                ]}
            />
            <div className="flex justify-center items-center">
                <h1 className="text-center text-3xl">Добавление поста</h1>
            </div>
            <Divider />
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => postStore.createPost(values).then(() => {
                    router.push('/control-panel/posts')
                })}
                initialValues={{ status: PostStatusEnum.NEW }}
            >
                <Form.Item
                    name="name"
                    label="Заголовок"
                    rules={[
                        { required: true, message: 'Введите заголовок поста!' },
                        { max: 100, message: 'Заголовок не должен превышать 100 символов!' }
                    ]}
                >
                    <Input placeholder="Введите название поста" maxLength={100} />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Описание"
                    rules={[
                        { max: 255, message: 'Описание не должно превышать 255 символов!' }
                    ]}
                >
                    <Input placeholder="Введите описание поста" maxLength={255} />
                </Form.Item>


                <Form.Item
                    name="image"
                    label="Изображение поста"
                >
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Нажмите или перетащите файл в эту область для загрузки</p>
                        <p className="ant-upload-hint">
                            Поддержка одиночной или массовой загрузки. Запрещено загружать конфиденциальные данные.
                        </p>
                    </Dragger>
                </Form.Item>

                <Form.Item
                    name="content"
                    label="Контент поста"
                    rules={[{ required: true, message: "Пожалуйста, введите содержание!" }]}
                >
                    <ReactQuill theme="snow" />
                </Form.Item>

                <div className="flex flex-col items-center">
                    <Form.Item style={{ marginTop: '10px' }}>
                        <Button type="primary" htmlType="submit" loading={postStore.loading}>Создать</Button>
                    </Form.Item>
                </div>
            </Form>
        </PageContainerControlPanel>
    )
}

export default observer(CreatePostPage);