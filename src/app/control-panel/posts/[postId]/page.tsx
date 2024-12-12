"use client"
import {PageContainerControlPanel} from "@/shared/ui";
import { Post } from "@/shared/api/posts/model";
import { useMobxStores } from "@/shared/store/RootStore";
import { Breadcrumb, Button, Divider, Form, Input, notification, UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { observer } from "mobx-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    ClockCircleOutlined,
    InboxOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import { getCookieUserDetails } from "@/lib/users";
import { UserRole } from "@/shared/api/user/model";

const ReactQuill = dynamic(
    () => import('react-quill'),
    { ssr: false }
)
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";

const postPage = () => {
    const { postStore } = useMobxStores();
    const { postId } = useParams();
    const router = useRouter();
    const [form] = Form.useForm<Post>();
    const [currentUser, setCurrentUser] = useState<any>(null);

    const [currentPost, setCurrentPost] = useState<Post | null>(null);

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
        postStore.getPostById(Number(postId)).then(response => {
            setCurrentPost(response!)
            form.setFieldsValue(response!)
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
                    <Input disabled={currentUser?.user.role === UserRole.SUPER_ADMIN} placeholder="Введите название поста" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Описание"
                    rules={[{ required: true, message: 'Введите описание поста!' }]}
                >
                    <Input disabled={currentUser?.user.role === UserRole.SUPER_ADMIN} placeholder="Введите описание поста" />
                </Form.Item>

                <Form.Item
                    name="image"
                    label="Изображение поста"
                >
                    <Dragger {...props} disabled={currentUser?.user.role === UserRole.SUPER_ADMIN}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Нажмите или перетащите файл в эту область для загрузки</p>
                        <p className="ant-upload-hint">
                            Поддержка одиночной или массовой загрузки. Запрещено загружать конфиденциальные данные.
                        </p>
                    </Dragger>
                </Form.Item>

                {/* {
                    currentUser?.user.role === UserRole.SUPER_ADMIN && <Form.Item
                        label="Статус"
                        name="status"
                    >
                        <Select
                            placeholder="Выберите статус"
                            style={{ width: '100%' }}

                        >
                            <Select.Option value={PostStatusEnum.NEW}>
                                <Tooltip title="Новый">
                                    <Tag icon={<ClockCircleOutlined />} color="blue">
                                        Новый
                                    </Tag>
                                </Tooltip>
                            </Select.Option>
                            <Select.Option value={PostStatusEnum.REJECT}>
                                <Tooltip color="red">
                                    <Tag color="red">Отклонен</Tag>
                                </Tooltip>
                            </Select.Option>

                            <Select.Option value={PostStatusEnum.IN_PROCESSING}>
                                <Tooltip title="В обработке">
                                    <Tag icon={<SyncOutlined spin />} color="yellow">
                                        В обработке
                                    </Tag>
                                </Tooltip>
                            </Select.Option>
                        </Select>
                    </Form.Item>

                } */}

                <Form.Item
                    name="content"
                    label="Контент поста"
                >
                    <ReactQuill theme="snow" />
                </Form.Item>

                <div className="flex flex-col items-center">
                    <Form.Item style={{ marginTop: '10px' }}>
                        <Button type="primary" htmlType="submit" loading={postStore.loading} disabled={currentUser?.user.role === UserRole.SUPER_ADMIN}>Изменить</Button>
                    </Form.Item>
                </div>
            </Form>
        </PageContainerControlPanel>
    )
}

export default observer(postPage);