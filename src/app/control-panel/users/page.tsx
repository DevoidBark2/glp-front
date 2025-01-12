"use client";
import { observer } from "mobx-react";
import { Button, Table, Tag, Tooltip, Popconfirm, notification } from "antd";
import type { TableColumnsType } from "antd";
import React, { useEffect, useState } from "react";
import { useMobxStores } from "@/stores/stores";
import {
    EditOutlined,
    DeleteOutlined,
    CheckOutlined, CloseOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { FILTER_ROLE_USER, FILTER_STATUS_USER, FORMAT_VIEW_DATE, userRoleColors } from "@/shared/constants";
import { showUserStatus } from "@/utils/showUserStatus";
import { useRouter } from "next/navigation";
import { usersTable } from "@/shared/config";
import { User } from "@/shared/api/user/model";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { PageHeader } from "@/shared/ui/PageHeader";
import { GroupActionComponent } from "@/widgets";

const UsersPage = () => {
    const { userStore } = useMobxStores();
    const router = useRouter();
    const [settings, setSettings] = useState<{
        pagination_size: number,
        table_size: SizeType,
        show_footer_table: boolean
    } | null>(null);

    const columns: TableColumnsType<User> = [
        {
            dataIndex: "first_name",
            title: "Полное имя",
            sorter: (a, b) => a.first_name.localeCompare(b.first_name),
            render: (_, record) =>
                `${record?.first_name || ''} ${record?.second_name || ''} ${record?.last_name || ''}`
        },
        {
            dataIndex: "role",
            title: "Роль",
            filters: FILTER_ROLE_USER,
            onFilter: (value, record) => record.role === value,
            render: (_, record) => <Tag color={userRoleColors[record.role]}>{record.role}</Tag>
        },
        {
            dataIndex: "status",
            title: "Статус",
            filters: FILTER_STATUS_USER,
            onFilter: (value, record) => record.status === value,
            render: (_, record) => showUserStatus(record.status)
        },
        {
            dataIndex: "email",
            title: "Email",
            render: (value, record) => (
                <Tooltip title="Нажмите, чтобы скопировать">
                    <span
                        className="cursor-pointer"
                        onClick={() => navigator.clipboard.writeText(value)}
                    >
                        {value}
                    </span>
                    <span style={{ marginLeft: 8 }}>
                        {record.isVerified ? (
                            <CheckOutlined style={{ color: "green", fontSize: "16px" }} />
                        ) : (
                            <CloseOutlined style={{ color: "red", fontSize: "16px" }} />
                        )}
                    </span>
                </Tooltip>
            ),
        },
        {
            dataIndex: "created_at",
            title: "Дата регистрации",
            sorter: (a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf(),
            render: (value) => dayjs(value).format(FORMAT_VIEW_DATE)
        },
        {
            title: "Действия",
            key: "actions",
            render: (_, record) => {
                return (
                    <div className="flex justify-end gap-2">
                        <Tooltip title="Редактировать">
                            <Button
                                shape="circle"
                                icon={<EditOutlined />}
                                onClick={() => router.push(`/control-panel/users/${record.id}`)}
                            />
                        </Tooltip>
                        <Tooltip title="Удалить">
                            <Popconfirm
                                title="Удалить пользователя?"
                                placement="leftBottom"
                                description="Вы уверены, что хотите удалить этого пользователя? Это действие нельзя будет отменить."
                                okText="Да"
                                onConfirm={() => userStore.deleteUsers(record.id).then(response => {
                                    notification.success({ message: response.message })
                                })}
                                cancelText="Нет"
                            >
                                <Button
                                    danger type="primary"
                                    icon={<DeleteOutlined />}
                                />
                            </Popconfirm>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        const settingUser = JSON.parse(window.localStorage.getItem('user_settings')!);
        setSettings(settingUser);
        userStore.getUsers();
    }, []);

    return (
        <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto custom-height-screen">
            <PageHeader
                title="Пользователи"
                showBottomDivider
            />
            <GroupActionComponent
                loading={userStore.loadingSearchUser}
                searchText={userStore.searchUserText}
                setSearchText={userStore.setSearchUserText}
            />
            <Table
                size={(settings && settings.table_size) ?? "middle"}
                footer={settings && settings.show_footer_table ? (table) => <div>Общее количество: {table.length}</div> : undefined}
                pagination={{ pageSize: Number((settings && settings.pagination_size) ?? 5) }}
                rowKey={(record) => record.id}
                dataSource={userStore.allUsers}
                columns={columns}
                loading={userStore.loading}
                showSorterTooltip={false}
                locale={usersTable}
            />
        </div>
    );
};

export default observer(UsersPage);
