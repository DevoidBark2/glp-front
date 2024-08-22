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
import {observer} from "mobx-react";
import {useMobxStores} from "@/stores/stores";
import React, {Key, useEffect, useState} from "react";
import {Post} from "@/stores/PostStore";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    InboxOutlined,
    PlusCircleOutlined,
    SyncOutlined,
    UploadOutlined
} from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";
import dayjs from "dayjs";
import {PostStatusEnum} from "@/enums/PostStatusEnum";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {FILTER_STATUS_POST, FORMAT_VIEW_DATE} from "@/constants";
import GroupActionComponent from "@/components/GroupActionComponent/GroupActionComponent";

const PostPage = () => {
    const {postStore} = useMobxStores();
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        onChange(info: any) {
            const {status} = info.file;
            if (status === 'done') {
                notification.success({message: `${info.file.name} загружен успешно.`});
                form.setFieldValue("image", info.file);
            } else if (status === 'error') {
                notification.error({message: `${info.file.name} ошибка загрузки.`});
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
                <Tooltip title={text}>
                    {text}
                </Tooltip>
            ),
        },
        {
            dataIndex: 'created_at',
            width: '20%',
            title: 'Дата публикации',
            sorter: (a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf(),
            render: (value) => dayjs(value).format(FORMAT_VIEW_DATE)
        },
        {
            title: "Статус",
            dataIndex: "status",
            filters: FILTER_STATUS_POST,
            onFilter: (value, record) => record.status.startsWith(value as string),
            filterSearch: true,
            render: (_, record) => getStatusTag(record.status,record.rejectReason),
        },
        {
            title: "Опубликован",
            dataIndex: "is_publish",
            render: (_, record) => (
                <Tooltip
                    title={record.status !== PostStatusEnum.ACTIVE ? "Отправьте сначала на проверку перед публикацией поста." : "Включите, чтобы опубликовать пост."}
                >
                    <Switch disabled={record.status !== PostStatusEnum.ACTIVE} defaultChecked={false} onChange={(checked) => console.log('Switch to:', checked)} />
                </Tooltip>
            ),
        },
        {
            title: "Действия",
            width: '20%',
            align: 'center',
            render: (_, record) => (
                <div className="flex justify-end">
                    {record.status === PostStatusEnum.NEW && (
                        <Tooltip title="Отправить на проверку">
                            <Button
                                type="default"
                                icon={<UploadOutlined />}
                                onClick={() => postStore.submitReview(record.id)}
                                className="mr-2"
                            />
                        </Tooltip>
                    )}
                    <Tooltip title="Редактировать пост">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            className="mr-2"
                            disabled={record.status === PostStatusEnum.IN_PROCESSING}
                            onClick={() => {
                                form.setFieldsValue(record);
                                setModalVisible(true)
                            }}
                        >
                            Изменить
                        </Button>
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
        postStore.getAllPosts();
    }, []);

    return (
        <div className="bg-white h-full p-5">
            <Modal
                title="Создать новый пост"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                afterClose={() => form.resetFields()}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => {
                        postStore.createPost(values);
                        setModalVisible(false);
                    }}
                >
                    <Form.Item
                        name="name"
                        label="Заголовок"
                        rules={[{required: true, message: 'Введите заголовок поста!'}]}
                    >
                        <Input placeholder="Введите название поста"/>
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Описание"
                        rules={[{required: true, message: 'Введите описание поста!'}]}
                    >
                        <Input placeholder="Введите описание поста"/>
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="Контент поста"
                    >
                        <ReactQuill theme="snow"/>
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Изображение поста"
                    >
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </p>
                            <p className="ant-upload-text">Нажмите или перетащите файл в эту область для загрузки</p>
                            <p className="ant-upload-hint">
                                Поддержка одиночной или массовой загрузки. Запрещено загружать конфиденциальные данные.
                            </p>
                        </Dragger>
                    </Form.Item>

                    <div className="flex flex-col items-center">
                        <Form.Item style={{marginTop: '10px'}}>
                            <Button type="primary" htmlType="submit" loading={postStore.loading}>Создать</Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-gray-800 font-bold text-3xl">Доступные посты</h1>
                <Button type="primary" icon={<PlusCircleOutlined/>} onClick={() => setModalVisible(true)}>
                    Добавить пост
                </Button>
            </div>
            <Table
                loading={postStore.loading}
                dataSource={postStore.allPosts}
                columns={columns}
                rowKey={(record) => record.id}
                rowClassName={(_, index) =>
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }
                rowSelection={{
                    type: "checkbox",
                    // onChange: (selectedRowKeys: Key[]) => {
                    //     userStore.setSelectedRowsUsers(selectedRowKeys.map(key => Number(key)));
                    // },
                }}
            />
        </div>
    );
}

export default observer(PostPage);
