import { Button, Form, FormInstance, Input, Modal, notification, Select, Tag, Tooltip, UploadProps } from "antd";
import dynamic from "next/dynamic";
import {
    ClockCircleOutlined,
    InboxOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import 'react-quill/dist/quill.snow.css';
import Dragger from "antd/es/upload/Dragger";
import { FC } from "react";
import { PostCreateForm, PostStatusEnum } from "@/shared/api/posts/model";
import { UserRole } from "@/shared/api/user/model";
const ReactQuill = dynamic(
    () => import('react-quill'),
    { ssr: false }
)

interface CreatePostModalProps {
    form:FormInstance<PostCreateForm>
    createPostModal: boolean
    setCreatePostModal: (value: boolean) => void
    createPost: (post: PostCreateForm) => Promise<void>
    currentUser: any
    postLoading: boolean
}

export const CreatePostModal: FC<CreatePostModalProps> = ({form,createPostModal,setCreatePostModal, createPost,currentUser,postLoading}) => {

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
    
    return(
        <Modal
        title="Создать новый пост"
        open={createPostModal}
        onCancel={() => setCreatePostModal(false)}
        footer={null}
        afterClose={() => form.resetFields()}
        centered
        width="60%"
    >
        <Form
            form={form}
            layout="vertical"
            onFinish={(values) => createPost(values).then(() => {
                setCreatePostModal(false);
            })}
            initialValues={{ status: PostStatusEnum.NEW }}
        >
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

            <Form.Item
                name="content"
                label="Контент поста"
            >
                <ReactQuill theme="snow" />
            </Form.Item>

            {
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

            }
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

            <div className="flex flex-col items-center">
                <Form.Item style={{ marginTop: '10px' }}>
                    <Button type="primary" htmlType="submit" loading={postLoading}>Создать</Button>
                </Form.Item>
            </div>
        </Form>
    </Modal>
    )
}