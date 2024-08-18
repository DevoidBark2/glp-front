"use client";
import { observer } from "mobx-react";
import {Button, Divider, Table, Tag, Tooltip, Space, Modal, message, Input, Select, Menu, Dropdown, Radio} from "antd";
import type { TableColumnsType } from "antd";
import React, { Key, useEffect, useState } from "react";
import { useMobxStores } from "@/stores/stores";
import { User } from "@/stores/UserStore";
import {
    EditOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import Link from "next/link";
import GlobalActionComponent from "@/components/GlobalActionComponent/GlobalActionComponent";
import useSelectedRows from "@/hooks/useSelectedRows";

const { Option } = Select;

const UsersPage = () => {
    const { userStore } = useMobxStores();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const { selectedRows, setSelectedRows } = useSelectedRows();
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [bulkAction, setBulkAction] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>("");

    useEffect(() => {
        userStore.getUsers();
    }, []);

    const handleSave = (record: User) => {
        // Implement saving logic here
        message.success(`User ${record.first_name} saved successfully!`);
        setEditingKey(null);
    };

    const handleBulkStatusUpdate = (status: boolean) => {
        if (selectedRows.length === 0) {
            message.warning("Выберите пользователей,которых хотите удалить!");
            return;
        }

        userStore.deleteUsers(selectedRows).then()

        // selectedRows.forEach((id) => {
        //     const user = userStore.allUsers.find(user => user.id === id);
        //     if (user) {
        //         user.is_active = status;
        //     }
        // });
        // message.success(`Users updated successfully!`);
        // userStore.getUsers(); // Refresh data
        // setSelectedRows([]);
    };

    const handleBulkEmail = () => {
        if (selectedRows.length === 0) {
            message.warning("Выберите элементы");
            return;
        }
        message.success("Emails sent successfully!");
    };

    const isEditing = (record: User) => record.id === Number(editingKey);

    const columns: TableColumnsType<User> = [
        {
            dataIndex: "first_name",
            title: "Полное имя",
            render: (text, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Input
                        defaultValue={record.first_name}
                        onChange={(e) => (record.first_name = e.target.value)}
                    />
                ) : (
                    `${record.first_name} ${record.second_name} ${record.last_name}`
                );
            },
            sorter: (a, b) => a.first_name.localeCompare(b.first_name),
            filterSearch: true,
            onFilter: (value, record) =>
                record.first_name.toLowerCase().includes(value.toString().toLowerCase()) ||
                record.second_name.toLowerCase().includes(value.toString().toLowerCase()),
        },
        {
            dataIndex: "role",
            title: "Роль",
            filters: [
                {
                    text: (
                        <Tag color="geekblue">
                            Студент
                        </Tag>
                    ),
                    value: 'student',
                },
                {
                    text: (
                        <Tag color="red">
                            Преподаватель
                        </Tag>
                    ),
                    value: 'teacher',
                },
            ],
            onFilter: (value, record) => record.role === value,
            render: (role) => {
                const color = role === "teacher" ? "red" : role === "student" ? "geekblue" : "green";
                return <Tag color={color}>{role}</Tag>;
            },
        },
        {
            dataIndex: "is_active",
            title: "Статус",
            filters: [
                { text: <Tag icon={<CheckCircleOutlined />} color="success">
                        Активен
                    </Tag>, value: true },
                { text: <Tag icon={<CloseCircleOutlined />} color="error">
                        Неактивен
                    </Tag>, value: false },
            ],
            onFilter: (value, record) => record.is_active === value,
            render: (isActive) =>
                isActive ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                        Активен
                    </Tag>
                ) : (
                    <Tag icon={<CloseCircleOutlined />} color="error">
                        Неактивен
                    </Tag>
                ),
        },
        {
            dataIndex: "email",
            title: "Email",
            render: (email) => (
                <Tooltip title="Нажмите, чтобы скопировать">
                    <span
                        style={{ cursor: "pointer" }}
                        onClick={() => navigator.clipboard.writeText(email)}
                    >
                        {email}
                    </span>
                </Tooltip>
            ),
        },
        {
            dataIndex: "created_at",
            title: "Дата регистрации",
            sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
            render: (value) => dayjs(value).format("DD.MM.YYYY HH:mm")
        },
        {
            title: "Действия",
            key: "actions",
            render: (_, record) => {
                const editable = isEditing(record);
                return (
                    <div className="flex items-center justify-start">
                        <Tooltip title="Редактировать">
                            <Button
                                shape="circle"
                                icon={editable ? <SaveOutlined /> : <EditOutlined />}
                                onClick={() => editable ? handleSave(record) : setEditingKey(record.id.toString())}
                                style={{ marginRight: '10px' }}
                            />
                        </Tooltip>
                        <Tooltip title="Удалить">
                            <Button
                                danger type="primary"
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("list"); // list or grid

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        // Implement search logic here
    };

    return (
        <div className="bg-white h-full p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto">
                    <h1 className="text-green-600 font-bold text-3xl mb-4 md:mb-0 md:mr-4">
                        Пользователи
                    </h1>
                    <GlobalActionComponent
                        handleDelete={handleBulkStatusUpdate}
                        handleExport={handleBulkEmail}
                    />
                </div>
                <div className="flex items-center mt-4 md:mt-0">
                    <Link href={"users/add"}>
                        <Button
                            type="primary"
                            icon={<PlusCircleOutlined/>}
                            className="flex items-center justify-center transition-transform transform hover:scale-105"
                            style={{
                                backgroundColor: '#4CAF50',
                                borderColor: '#4CAF50',
                            }}
                        >
                            <span className="hidden sm:inline">Новый пользователь</span>
                        </Button>
                    </Link>
                </div>
            </div>
            <Divider/>
            <Space style={{marginBottom: 16}}>
                <Input.Search
                    placeholder="Поиск по имени"
                    enterButton
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onSearch={(value) => setSearchText(value)}
                />
                <Select
                    placeholder="Групповые действия"
                    style={{width: 200}}
                    onChange={(value) => setBulkAction(value)}
                >
                    <Option value="activate">Активировать</Option>
                    <Option value="deactivate">Деактивировать</Option>
                    <Option value="email">Отправить Email</Option>
                </Select>
                <Button
                    type="primary"
                    onClick={() => {
                        if (bulkAction === "activate") handleBulkStatusUpdate(true);
                        if (bulkAction === "deactivate") handleBulkStatusUpdate(false);
                        if (bulkAction === "email") handleBulkEmail();
                    }}
                >
                    Применить
                </Button>
            </Space>
            <Table
                rowKey={(record) => record.id}
                dataSource={userStore.allUsers}
                columns={columns}
                pagination={{pageSize: 10}}
                loading={userStore.loading}
                showSorterTooltip={false}
                rowClassName={(record, index) =>
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }
                rowSelection={{
                    type: "checkbox",
                    onChange: (selectedRowKeys: Key[]) => {
                        const selectedRowsArray: number[] = selectedRowKeys.map(key =>
                            Number(key),
                        );
                        setSelectedRows(selectedRowsArray);
                    },
                }}
            />
            <Modal
                open={!!selectedUser}
                title="Редактирование пользователя"
                onCancel={() => setSelectedUser(null)}
                footer={null}
            >
                {selectedUser && (
                    <div>
                        <p><strong>Полное имя:</strong> {`${selectedUser.first_name} ${selectedUser.second_name}`}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Роль:</strong> {selectedUser.role}</p>
                        <p><strong>Статус:</strong> {selectedUser.is_active ? "Активен" : "Неактивен"}</p>
                        <p><strong>Дата
                            регистрации:</strong> {dayjs(selectedUser.created_at).format("DD.MM.YYYY HH:mm")}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default observer(UsersPage);
