"use client";
import { observer } from "mobx-react";
import { Button, Divider, Table, Tag, Tooltip, message, Popconfirm, Dropdown } from "antd";
import type { MenuProps, TableColumnsType } from "antd";
import React, { Key, useEffect } from "react";
import { useMobxStores } from "@/stores/stores";
import { User } from "@/stores/UserStore";
import Image from "next/image";
import {
    EditOutlined,
    DeleteOutlined,
    PlusCircleOutlined, MoreOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import Link from "next/link";
import GlobalActionComponent from "@/components/GlobalActionComponent/GlobalActionComponent";
import { FILTER_ROLE_USER, FILTER_STATUS_USER, FORMAT_VIEW_DATE, userRoleColors } from "@/constants";
import GroupActionComponent from "@/components/GroupActionComponent/GroupActionComponent";
import { showUserStatus } from "@/utils/showUserStatus";
import { paginationCount, usersTable } from "@/tableConfig/usersTable";
import { useRouter } from "next/navigation";

const UsersPage = () => {
    const { userStore } = useMobxStores();
    const router = useRouter();

    const handleBulkStatusUpdate = (status: boolean) => {
        if (userStore.selectedRowsUser.length === 0) {
            message.warning("Выберите пользователей,которых хотите удалить!");
            return;
        }

        userStore.deleteUsers(userStore.selectedRowsUser).then()
    };

    const handleBulkEmail = () => {
        if (userStore.selectedRowsUser.length === 0) {
            message.warning("Выберите элементы");
            return;
        }
        message.success("Emails sent successfully!");
    };

    const columns: TableColumnsType<User> = [
        {
            dataIndex: "first_name",
            title: "Полное имя",
            sorter: (a, b) => a.first_name.localeCompare(b.first_name),
            render: (_, record) => `${record.first_name} ${record.second_name} ${record.last_name}`
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
            render: (email) => (
                <Tooltip title="Нажмите, чтобы скопировать">
                    <span className="cursor-pointer" onClick={() => navigator.clipboard.writeText(email)}>{email}</span>
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
                    <div className="flex items-center justify-start">
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
                                cancelText="Нет"
                            >
                                <Button
                                    className="ml-3"
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
        userStore.getUsers();
    }, []);

    return (
        <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto custom-height-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div className="flex">
                    <h1 className="text-gray-800 font-bold text-3xl mb-4 md:mb-0 md:mr-4">
                        Пользователи
                    </h1>
                    {/* <GlobalActionComponent
                        handleDelete={handleBulkStatusUpdate}
                        handleSendNotifications={handleBulkEmail}
                    /> */}
                </div>
                <div className="flex items-center mt-4 md:mt-0">
                    <Link href={"users/add"}>
                        <Button
                            type="primary"
                            icon={<PlusCircleOutlined />}
                            className="flex items-center justify-center transition-transform transform hover:scale-105"
                        >
                            <span className="hidden sm:inline">Новый пользователь</span>
                        </Button>
                    </Link>
                </div>
            </div>
            <Divider />
            <GroupActionComponent
                loading={userStore.loadingSearchUser}
                searchText={userStore.searchUserText}
                setSearchText={userStore.setSearchUserText}
                selectedAction={userStore.selectedGroupAction}
                setSelectedAction={userStore.setSelectedGroupAction}
                submitSelectedAction={userStore.submitSelectedAction}
            />
            <Table
                rowKey={(record) => record.id}
                dataSource={userStore.allUsers}
                columns={columns}
                pagination={{ pageSize: paginationCount }}
                loading={userStore.loading}
                showSorterTooltip={false}
                rowSelection={{
                    type: "checkbox",
                    onChange: (selectedRowKeys: Key[]) => {
                        userStore.setSelectedRowsUsers(selectedRowKeys.map(key => Number(key)));
                    },
                }}
                locale={usersTable}
            />
        </div>
    );
};

export default observer(UsersPage);
