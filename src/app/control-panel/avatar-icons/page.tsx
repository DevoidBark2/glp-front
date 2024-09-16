"use client"
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    Modal, notification, Popconfirm,
    Row,
    Select,
    Switch,
    Table,
    TableColumnsType,
    Tag,
    Tooltip, UploadProps
} from "antd";
import {
    DeleteOutlined,
    EditOutlined, InboxOutlined,
    MoreOutlined,
    PlusCircleOutlined,
    PlusOutlined,
    UploadOutlined
} from "@ant-design/icons";
import Image from "next/image";
import React, {useEffect} from "react";
import {observer} from "mobx-react";
import dayjs from "dayjs";
import {FILTER_STATUS_POST, FORMAT_VIEW_DATE} from "@/constants";
import Dragger from "antd/es/upload/Dragger";
import {useMobxStores} from "@/stores/stores";
import {AvatarIcon} from "@/stores/AvatarIconsStore";

const AvatarIconsPage = () => {
    const {avatarIconsStore} = useMobxStores();
    const columns: TableColumnsType<AvatarIcon> = [
        {
            title: 'Иконка',
            dataIndex: 'image',
            width: '20%',
            render: (text) => (
                <Tooltip title="Изображение аватарки">
                    <Image crossOrigin="anonymous" src={`http://localhost:5000${text}`} width={50} height={50} alt="text" />
                </Tooltip>
            ),
        },
        {
            title: 'Дата публикации',
            dataIndex: 'created_at',
            width: '20%',
            sorter: (a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf(),
            render: (value) => (
                <Tooltip title={dayjs(value).format(FORMAT_VIEW_DATE)}>
                    <p className="text-gray-600 dark:text-gray-300">
                        <i className="fas fa-calendar-alt"></i> {dayjs(value).format(FORMAT_VIEW_DATE)}
                    </p>
                </Tooltip>
            ),
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            filters: FILTER_STATUS_POST,
            onFilter: (value, record) => record.status.startsWith(value as string),
            filterSearch: true,
            render: (status) => {
                let color = 'geekblue';
                let statusLabel = 'Неизвестный';

                switch (status) {
                    case 'active':
                        color = 'green';
                        statusLabel = 'Активный';
                        break;
                    case 'pending':
                        color = 'orange';
                        statusLabel = 'На проверке';
                        break;
                    case 'draft':
                        color = 'gray';
                        statusLabel = 'Черновик';
                        break;
                    case 'archived':
                        color = 'red';
                        statusLabel = 'Архивирован';
                        break;
                }

                return (
                    <Tooltip title={`Статус: ${statusLabel}`}>
                        <Tag color={color} className="uppercase">
                            {statusLabel}
                        </Tag>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Действия',
            width: '20%',
            align: 'center',
            render: (_, record) => (
                <div className="flex justify-end gap-2">
                    <Tooltip title="Отправить на проверку">
                        <Button
                            type="default"
                            icon={<UploadOutlined />}
                        />
                    </Tooltip>
                    <Tooltip title="Редактировать пост">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                        />
                    </Tooltip>
                    <Tooltip title="Удалить пост">
                        <Popconfirm
                            title="Удалить пост?"
                            description="Вы уверены, что хотите удалить этот пост? Это действие нельзя будет отменить."
                            okText="Да"
                            cancelText="Нет"
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


    const [form] = Form.useForm();

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

    useEffect(() => {
        avatarIconsStore.getAllAvatarIcons();
    },[])

    return (
        <>
            <Modal
                open={avatarIconsStore.showCreateModal}
                onCancel={() => avatarIconsStore.setShowCreateModal(false)}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={(values) => avatarIconsStore.createAvatarIcon(values)}
                >
                    <Form.Item
                        name="image"
                        label="Изображение"
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
                            <Button type="primary" htmlType="submit" loading={avatarIconsStore.loadingAvatars}>Создать</Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
            <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto" style={{height: 'calc(100vh - 60px)'}}>
                <div className="flex items-center justify-between">
                    <h1 className="text-gray-800 font-bold text-3xl mb-2">Доступные иконки</h1>
                    <div>
                        <Button
                            className="flex items-center justify-center transition-transform transform hover:scale-105"
                            icon={<PlusCircleOutlined/>}
                            type="primary"
                            onClick={() => avatarIconsStore.setShowCreateModal(true)}
                        >
                            Добавить аватар
                        </Button>
                        <Button className="ml-2" icon={ <MoreOutlined />}/>
                    </div>
                </div>
                <Divider />
                <Table
                    rowKey={(record) => record.id}
                    dataSource={avatarIconsStore.avatarIcons}
                    columns={columns}
                />
            </div>
        </>
    );
}

export default observer(AvatarIconsPage)