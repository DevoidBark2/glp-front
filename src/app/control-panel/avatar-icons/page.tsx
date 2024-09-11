"use client"
import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    Modal, Popconfirm,
    Row,
    Select,
    Switch,
    Table,
    TableColumnsType,
    Tag,
    Tooltip
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    MoreOutlined,
    PlusCircleOutlined,
    PlusOutlined,
    UploadOutlined
} from "@ant-design/icons";
import React from "react";
import {observer} from "mobx-react";
import {Post} from "@/stores/PostStore";
import dayjs from "dayjs";
import {FILTER_STATUS_POST, FORMAT_VIEW_DATE} from "@/constants";
import {PostStatusEnum} from "@/enums/PostStatusEnum";

const AvatarIconsPage = () => {
    const columns = [
        {
            title: 'Иконка',
            dataIndex: 'name',
            width: '20%',
            render: (text) => (
                <span className="dark:text-white">{text}</span>
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
                            />
                        </Tooltip>
                    )}
                    <Tooltip title="Редактировать пост">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            disabled={record.status === PostStatusEnum.IN_PROCESSING}
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
    return (
        <>
            <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto" style={{height: 'calc(100vh - 60px)'}}>
                <div className="flex items-center justify-between">
                    <h1 className="text-gray-800 font-bold text-3xl mb-2">Доступные иконки</h1>
                    <div>
                        <Button
                            className="flex items-center justify-center transition-transform transform hover:scale-105"
                            icon={<PlusCircleOutlined/>}
                            type="primary"
                        >
                            Добавить аватар
                        </Button>
                        <Button className="ml-2" icon={ <MoreOutlined />}/>
                    </div>
                </div>
                <Divider />
                <Table
                    rowKey={(record) => record.id}
                    dataSource={[]}
                    columns={columns}
                />
            </div>
        </>
    );
}

export default observer(AvatarIconsPage)