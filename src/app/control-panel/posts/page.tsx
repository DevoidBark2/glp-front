"use client";
import {
    Button,
    Col,
    Form,
    Input,
    Modal,
    notification,
    Popconfirm,
    Popover,
    Row,
    Select,
    Switch,
    Table,
    TableColumnsType,
    Tag,
    Tooltip,
    Typography,
    UploadProps
} from "antd";
import { observer } from "mobx-react";
import { useMobxStores } from "@/stores/stores";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Post } from "@/stores/PostStore";
import {
    CheckCircleOutlined,
    ClockCircleOutlined, CloseOutlined,
    CrownOutlined,
    DeleteOutlined,
    EditOutlined,
    InboxOutlined,
    SyncOutlined,
    UploadOutlined,
    UserOutlined
} from "@ant-design/icons";
import dynamic from 'next/dynamic'
import Dragger from "antd/es/upload/Dragger";
import dayjs from "dayjs";
import { PostStatusEnum } from "@/enums/PostStatusEnum";
import 'react-quill/dist/quill.snow.css';
import { FILTER_STATUS_POST, FORMAT_VIEW_DATE, MAIN_COLOR } from "@/constants";
import PageHeader from "@/components/PageHeader/PageHeader";
import { postTable } from "@/tableConfig/postTable";
import { getCookieUserDetails } from "@/lib/users";
import { UserRole } from "@/enums/UserRoleEnum";
import Link from "next/link";
const ReactQuill = dynamic(
    () => import('react-quill'),
    { ssr: false }
)

const UserCard = ({ user }) => (
    <div className="p-4">
        <Typography.Title level={5}>
            {`${user.second_name} ${user.first_name} ${user.last_name}`}
        </Typography.Title>
        <Typography.Paragraph>
            <strong>Email:</strong> {user.email}
        </Typography.Paragraph>
        <Typography.Paragraph>
            <strong>Телефон:</strong> {user.phone}
        </Typography.Paragraph>
        <Link href={`/control-panel/users/${user.id}`}>
            <Button type="link" style={{ paddingLeft: 0 }}>
                Посмотреть профиль
            </Button>
        </Link>
    </div>
);

const PostPage = () => {
    const { postStore } = useMobxStores();
    const [currentUser, setCurrentUser] = useState(null);
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false)

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
            case PostStatusEnum.APPROVED:
                return (
                    <Tooltip title="Подтвержден">
                        <Tag icon={<CheckCircleOutlined />} color="green">
                            Подтвержден
                        </Tag>
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

    const renderTooltipTitle = (record: Post) => {
        switch (record.status) {
            case PostStatusEnum.NEW:
                return "Отправьте сначала на проверку и ожидайте подтверждения перед публикацией поста.";
            case PostStatusEnum.IN_PROCESSING:
                return "Ожидайте подтверждения модератором."
            case PostStatusEnum.REJECT:
                return "Пост был отклонен модератором,больше информации находится в форме редактирования поста."
            case PostStatusEnum.APPROVED:
                return "Пост успешно прошел проверку, Вы можете опубликовать данные пост."
        }
    }

    const columns: TableColumnsType<Post> = [
        {
            title: 'Название',
            dataIndex: 'name',
            width: '20%',
            render: (text) => (
                <Tooltip title={text}>
                    <span className="dark:text-white">{text}</span>
                </Tooltip>
            ),
        },
        {
            dataIndex: 'created_at',
            width: '20%',
            title: 'Дата публикации',
            showSorterTooltip: false,
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
                    title={currentUser?.user.role !== UserRole.SUPER_ADMIN
                        ? renderTooltipTitle(record)
                        : undefined}
                >
                    <Switch disabled={record.status !== PostStatusEnum.APPROVED && currentUser?.user.role !== UserRole.SUPER_ADMIN} defaultChecked={record.is_publish} onChange={(checked) => console.log('Switch to:', checked)} />
                </Tooltip>
            ),
        },
        {
            title: "Создатель",
            dataIndex: "user",
            hidden: currentUser?.user.role !== UserRole.SUPER_ADMIN,
            render: (_, record) => (
                record.user.role === UserRole.SUPER_ADMIN ?
                    <div> <Link href={`/control-panel/profile`} className="hover:text-yellow-500">
                        <Tooltip title="Перейти в профиль">
                            <Tag icon={<CrownOutlined />} color="gold" style={{ marginRight: 8 }}>
                                Администратор
                            </Tag>
                        </Tooltip>
                    </Link>
                    </div> : <div>
                        <Popover
                            content={<UserCard user={record.user} />}
                            title="Краткая информация"
                            trigger="hover"
                        >
                            {/* Условие для отображения разных стилей для super_admin */}
                            <UserOutlined style={{ marginRight: 8, color: MAIN_COLOR, fontSize: "18px" }} />

                            {record.user.role === UserRole.SUPER_ADMIN ? (
                                <Link href={`/control-panel/profile`} className="hover:text-yellow-500">
                                    <Tag icon={<CrownOutlined />} color="gold" style={{ marginRight: 8 }}>
                                        Super Admin
                                    </Tag>
                                </Link>
                            ) : (
                                // Обычный пользователь
                                <Link href={`/control-panel/users/${record.user.id}`} className="hover:text-blue-500">
                                    {`${record.user.second_name} ${record.user.first_name} ${record.user.last_name}`}
                                </Link>
                            )}
                        </Popover>
                    </div>
            ),
        },
        {
            title: "Действия",
            width: '20%',
            align: 'center',
            render: (_, record) => (
                <div className="flex justify-end gap-2">
                    {(record.status === PostStatusEnum.NEW && currentUser?.user.role !== UserRole.SUPER_ADMIN) && (
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

    useEffect(() => {
        const user = getCookieUserDetails();
        setCurrentUser(user);
        postStore.getUserPosts();
    }, []);

    return (
        <div className="bg-white dark:bg-[#001529] dark:shadow-cyan-500/50 rounded-md h-full p-5 shadow-2xl  overflow-y-auto custom-height-screen">
            <Modal
                title={modalVisible ? "Редактировать пост" : "Создать новый пост"}
                open={postStore.createPostModal}
                onCancel={() => postStore.setCreatePostModal(false)}
                footer={null}
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
                    initialValues={{ status: PostStatusEnum.ACTIVE }}
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
                                <Select.Option value={PostStatusEnum.ACTIVE}>
                                    <Tooltip title="Активный">
                                        <Tag icon={<CheckCircleOutlined />} color="green">
                                            Активный
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
                rowClassName={(record) => {
                    if (record.status !== PostStatusEnum.APPROVED && record.user.role !== UserRole.SUPER_ADMIN) {
                        return 'row-disabled';
                    }
                    return '';
                }}
                locale={postTable({ setShowModal: () => postStore.setCreatePostModal(true) })}
            />
        </div>
    );
}

export default observer(PostPage);
