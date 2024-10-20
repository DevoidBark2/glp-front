"use client";
import {
    Button,
    Form,
    Input,
    Modal,
    notification,
    Popconfirm,
    Switch,
    Table,
    TableColumnsType,
    Tag,
    Tooltip,
    UploadProps
} from "antd";
import { observer } from "mobx-react";
import { useMobxStores } from "@/stores/stores";
import React, { useEffect } from "react";
import { Post } from "@/stores/PostStore";
import {
    CheckCircleOutlined,
    ClockCircleOutlined, CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    InboxOutlined,
    SyncOutlined,
    UploadOutlined
} from "@ant-design/icons";
import dynamic from 'next/dynamic'
import Dragger from "antd/es/upload/Dragger";
import dayjs from "dayjs";
import { PostStatusEnum } from "@/enums/PostStatusEnum";
import 'react-quill/dist/quill.snow.css';
import { FILTER_STATUS_POST, FORMAT_VIEW_DATE } from "@/constants";
import { useTheme } from "next-themes";
import PageHeader from "@/components/PageHeader/PageHeader";
import { postTable } from "@/tableConfig/postTable";
const ReactQuill = dynamic(
    () => import('react-quill'),
    { ssr: false }
)

const PostPage = () => {
    const { postStore } = useMobxStores();
    const [form] = Form.useForm();

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        onChange(info: any) {
            const { status } = info.file;
            if (status === 'done') {
                notification.success({ message: `${info.file.name} загружен успешно.` });
                form.setFieldValue("image", info.file);
            } else if (status === 'error') {
                notification.error({ message: `${info.file.name} ошибка загрузки.` });
            }
        },
        onDrop(e) {
            console.log('Файлы перетащены', e.dataTransfer.files);
        },
    };

    const getStatusTag = (status: PostStatusEnum, rejectReason?: string[]) => {
        switch (status) {
            case PostStatusEnum.NEW:
                return (
                    <Tooltip title="Новый">
                        <Tag icon={<ClockCircleOutlined />} color="blue">
                            Новый
                        </Tag>
                    </Tooltip>
                );
            case PostStatusEnum.IN_PROCESSING:
                return (
                    <Tooltip title="В обработке">
                        <Tag icon={<SyncOutlined spin />} color="yellow">
                            В обработке
                        </Tag>
                    </Tooltip>
                );
            case PostStatusEnum.ACTIVE:
                return (
                    <Tooltip title="Активный">
                        <Tag icon={<CheckCircleOutlined />} color="green">
                            Активный
                        </Tag>
                    </Tooltip>
                );
            case PostStatusEnum.REJECT:
                return (
                    <Tooltip title={rejectReason?.map((reason, index) => (
                        <div key={index}>• {reason}</div>
                    ))} color="red">
                        <Tag color="red">Отклонен</Tag>
                    </Tooltip>
                );
            default:
                return (
                    <Tooltip title="Неизвестный статус">
                        <Tag color="gray">Неизвестный</Tag>
                    </Tooltip>
                );
        }
    };

    const columns: TableColumnsType<Post> = [
        {
            title: 'Название',
            dataIndex: 'name',
            width: '20%',
            render: (text) => (
                <Tooltip color={resolvedTheme === "light" ? "black" : "white"} title={<label style={{ color: resolvedTheme === "light" ? "white" : "black" }}>{text}</label>}>
                    <span className="dark:text-white">{text}</span>
                </Tooltip>
            ),
        },
        {
            dataIndex: 'created_at',
            width: '20%',
            title: 'Дата публикации',
            sorter: (a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf(),
            render: (value) => <p className="dark:text-white">{dayjs(value).format(FORMAT_VIEW_DATE)}</p>
        },
        {
            title: "Статус",
            dataIndex: "status",
            filters: FILTER_STATUS_POST,
            onFilter: (value, record) => record.status.startsWith(value as string),
            filterSearch: true,
            render: (_, record) => getStatusTag(record.status, record.rejectReason),
        },
        {
            title: "Опубликован",
            dataIndex: "is_publish",
            render: (_, record) => (
                <Tooltip
                    title={record.status !== PostStatusEnum.ACTIVE ? "Отправьте сначала на проверку перед публикацией поста." : "Включите, чтобы опубликовать пост."}
                >
                    <Switch disabled={record.status !== PostStatusEnum.ACTIVE} defaultChecked={record.is_publish} onChange={(checked) => console.log('Switch to:', checked)} />
                </Tooltip>
            ),
        },
        {
            title: "Действия",
            width: '20%',
            align: 'center',
            render: (_, record) => (
                <div className="flex justify-end gap-2">
                    {record.status === PostStatusEnum.NEW && (
                        <Tooltip title="Отправить на проверку">
                            <Button
                                type="default"
                                icon={<UploadOutlined />}
                                onClick={() => postStore.submitReview(record.id)}
                            />
                        </Tooltip>
                    )}
                    <Tooltip title="Редактировать пост">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            disabled={record.status === PostStatusEnum.IN_PROCESSING}
                            onClick={() => {
                                debugger
                                form.setFieldsValue(record);
                                setModalVisible(true)
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Удалить пост">
                        <Popconfirm
                            title="Удалить пост?"
                            description="Вы уверены, что хотите удалить этот пост? Это действие нельзя будет отменить."
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={() => postStore.deletePost(record.id)}
                        >
                            <Button
                                danger
                                type="primary"
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Tooltip>
                </div>
            ),
        },

    ];
    const { resolvedTheme } = useTheme()

    useEffect(() => {
        postStore.getUserPosts();
    }, []);

    return (
        <div className="bg-white dark:bg-[#001529] dark:shadow-cyan-500/50 rounded-md h-full p-5 shadow-2xl  overflow-y-auto custom-height-screen">
            <Modal
                styles={{
                    content: { backgroundColor: resolvedTheme === "dark" ? "#001529" : "white" },
                    header: { backgroundColor: resolvedTheme === "dark" ? "#001529" : "white" },
                }}
                title={<label style={{ color: resolvedTheme === "light" ? "black" : "white" }}>Создать новый пост</label>}
                open={postStore.createPostModal}
                onCancel={() => postStore.setCreatePostModal(false)}
                footer={null}
                closeIcon={<CloseOutlined style={{ color: resolvedTheme === "light" ? "#000" : "#fff" }} />}
                afterClose={() => form.resetFields()}
                centered
                width="60%"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => {
                        postStore.createPost(values);
                        postStore.setCreatePostModal(false)
                    }}
                >
                    <Form.Item
                        name="name"
                        label={<label style={{ color: resolvedTheme === "light" ? "black" : "white" }}>Заголовок</label>}
                        rules={[{ required: true, message: 'Введите заголовок поста!' }]}
                    >
                        <Input style={{ backgroundColor: resolvedTheme === "dark" ? "#001529" : "white" }} placeholder="Введите название поста" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label={<label style={{ color: resolvedTheme === "light" ? "black" : "white" }}>Описание</label>}
                        rules={[{ required: true, message: 'Введите описание поста!' }]}
                    >
                        <Input placeholder="Введите описание поста" />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label={<label style={{ color: resolvedTheme === "light" ? "black" : "white" }}>Контент поста</label>}
                    >
                        <ReactQuill theme="snow" />
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label={<label style={{ color: resolvedTheme === "light" ? "black" : "white" }}>Изображение поста</label>}
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
                            <Button type="primary" htmlType="submit" loading={postStore.loading}>Создать</Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
            <PageHeader
                title="Доступные посты"
                buttonTitle="Добавить пост"
                onClickButton={() => postStore.setCreatePostModal(true)}
                showBottomDivider
            />
            <Table
                loading={postStore.loading}
                dataSource={postStore.userPosts}
                columns={columns}
                rowKey={(record) => record.id}
                locale={postTable({ setShowModal: () => postStore.setCreatePostModal(true) })}
            />
        </div>
    );
}

export default observer(PostPage);
