"use client";
import {observer} from "mobx-react";
import {Button, Divider, Input, Table, TableColumnsType, Tag, Tooltip, Space, Modal} from "antd";
import React, {useEffect, useState} from "react";
import {useMobxStores} from "@/stores/stores";
import {User} from "@/stores/UserStore";
import {SearchOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";
import dayjs from "dayjs";

const UsersPage = () => {
    const {userStore} = useMobxStores();
    const [searchText, setSearchText] = useState<string>("");
    const [filteredData, setFilteredData] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const columns: TableColumnsType<User> = [
        {
            dataIndex: ["first_name", "second_name"],
            title: "Полное имя",
            render: (text, record) => `${record.first_name} ${record.second_name}`,
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
                {text: 'Администратор', value: 'admin'},
                {text: 'Пользователь', value: 'user'},
                {text: 'Модератор', value: 'moderator'},
            ],
            onFilter: (value, record) => record.role === value,
            render: (role) => {
                const color = role === "admin" ? "red" : role === "moderator" ? "geekblue" : "green";
                return <Tag color={color}>{role}</Tag>;
            },
        },
        {
            dataIndex: "is_active",
            title: "Статус",
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
            title: "Дата создания",
            render: (date) => dayjs(date).format("DD.MM.YYYY HH:mm"),
            sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
        },
        {
            title: "Действия",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => setSelectedUser(record)}
                    >
                        Редактировать
                    </Button>
                </Space>
            ),
        },
    ];

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        setFilteredData(
            userStore.allUsers.filter((item) =>
                `${item.first_name} ${item.second_name}`.toLowerCase().includes(value) ||
                item.email.toLowerCase().includes(value)
            )
        );
    };

    useEffect(() => {
        userStore.getUsers();
        // setFilteredData(userStore.allUsers);
    }, []);

    return (
        <div className="bg-white h-full p-5">
            <div className="flex items-center justify-between">
                <h1 className="text-green-800 font-bold text-3xl mb-2">Пользователи</h1>
                <Input
                    placeholder="Поиск по имени или email..."
                    value={searchText}
                    onChange={handleSearch}
                    prefix={<SearchOutlined />}
                    style={{ width: "300px" }}
                />
            </div>
            <Divider />
            <Table
                dataSource={userStore.allUsers}
                columns={columns}
                pagination={{ pageSize: 10 }}
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
                        <p><strong>Дата создания:</strong> {dayjs(selectedUser.created_at).format("DD.MM.YYYY HH:mm")}</p>
                        {/* Добавьте здесь форму для редактирования */}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default observer(UsersPage);
