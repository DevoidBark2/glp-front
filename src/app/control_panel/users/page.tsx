"use client";
import {observer} from "mobx-react";
import {Button, Divider, Table, Tag, Tooltip, Space, Modal} from "antd";
import type {TableColumnsType} from "antd"
import React, {useEffect, useState} from "react";
import {useMobxStores} from "@/stores/stores";
import {User} from "@/stores/UserStore";
import {
    EditOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    PlusCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import Link from "next/link";

const UsersPage = () => {
    const {userStore} = useMobxStores();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const columns: TableColumnsType<User> = [
        {
            dataIndex: "first_name",
            title: "Полное имя",
            render: (text, record) => `${record.first_name} ${record.second_name} ${record.last_name}`,
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
                {text: <Tag icon={<CheckCircleOutlined />} color="success">
                        Активен
                    </Tag>, value: true},
                {text: <Tag icon={<CloseCircleOutlined />} color="error">
                        Неактивен
                    </Tag>, value: false},
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
            render: (_, record) => (
                <div className="flex items-center justify-start">
                    <Tooltip title="Редактировать">
                        <Button
                            shape="circle"
                            icon={<EditOutlined/>}
                            onClick={() => setSelectedUser(record)}
                            style={{marginRight: '10px'}}
                        />
                    </Tooltip>
                    <Tooltip title="Удалить">
                        <Button
                            danger type="primary"
                            icon={<DeleteOutlined/>}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    useEffect(() => {
        userStore.getUsers();
    }, []);

    return (
        <div className="bg-white h-full p-5">
            <div className="flex items-center justify-between">
                <h1 className="text-green-800 font-bold text-3xl mb-2">Пользователи</h1>
                <div>
                    <Link href={"users/add"}>
                        <Button type="primary" icon={<PlusCircleOutlined />}>Новый пользователь</Button>
                    </Link>
                </div>
            </div>
            <Divider/>
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
                        <p><strong>Дата регистрации:</strong> {dayjs(selectedUser.created_at).format("DD.MM.YYYY HH:mm")}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default observer(UsersPage);
