"use client";
import Link from "next/link";
import { Table, TableColumnsType, Tooltip, Tag, Input, DatePicker, Button } from "antd";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    SearchOutlined,
    UserOutlined,
    DownloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { ActionEvent } from "@/shared/api/action-user";
import { eventColors, eventTooltips, FORMAT_VIEW_DATE, MAIN_COLOR } from "@/shared/constants";
import { EventUser } from "@/shared/api/events/model";
import { PageContainerControlPanel, PageHeader } from "@/shared/ui";
import {useMobxStores} from "@/shared/store/RootStore";
import {SettingControlPanel} from "@/shared/model";

const EventPage = () => {
    const { eventStore } = useMobxStores();
    const [searchText, setSearchText] = useState<string>("");
    const [filteredData, setFilteredData] = useState<EventUser[]>([]);
    const [settings, setSettings] = useState<SettingControlPanel | null>(null);

    const columns: TableColumnsType<EventUser> = [
        {
            dataIndex: "createdAt",
            title: "Дата и время",
            width: "15%",
            sorter: (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
            render: (value) => dayjs(value).format(FORMAT_VIEW_DATE),
        },
        {
            dataIndex: "action",
            title: "Событие",
            filters: Object.keys(eventColors).map((key) => ({
                text: (
                    <Tooltip title={eventTooltips[key as ActionEvent] || "Описание недоступно"}>
                        <Tag color={eventColors[key as ActionEvent]}>{key}</Tag>
                    </Tooltip>
                ),
                value: key,
            })),
            onFilter: (value, record) => record.action === value,
            render: (value, record) => {
                const color = eventColors[record.action] || "default";
                const tooltipText = eventTooltips[record.action] || "Описание недоступно";

                return (
                    <Tooltip title={tooltipText}>
                        <Tag color={color}>{value}</Tag>
                    </Tooltip>
                );
            },
        },
        {
            dataIndex: "description",
            title: "Описание",
            ellipsis: true,
            render: (text) => (
                <Tooltip title={text}>
                    <span>{text}</span>
                </Tooltip>
            ),
        },
        {
            dataIndex: "success",
            title: "Статус",
            width: "10%",
            render: (success) => {
                return success ? (
                    <Tag color="green">
                        <CheckCircleOutlined style={{ marginRight: 4 }} />
                        Успех
                    </Tag>
                ) : (
                    <Tag color="red">
                        <CloseCircleOutlined style={{ marginRight: 4 }} />
                        Неуспех
                    </Tag>
                );
            },
        },
        {
            dataIndex: "user",
            title: "Пользователь",
            render: (value, record) => (
                <div>
                    <UserOutlined style={{ marginRight: 8, color: MAIN_COLOR, fontSize: "18px" }} />
                    <Link
                        href={`/control-panel/users/${record.id}`}
                        className="hover:text-black"
                    >
                        {`${record.user.second_name ?? ""} ${record.user.first_name ?? ""} ${record.user.last_name ?? ""}`}
                    </Link>
                </div>
            ),
        },
    ];

    const handleRefresh = () => {
        eventStore.getAllEvents().finally(() => {
            eventStore.setLoadingEvents(false);
        });
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        setFilteredData(
            eventStore.userEvents.filter((item) =>
                Object.values(item).some(
                    (val) => typeof val === "string" && val.toLowerCase().includes(value)
                )
            )
        );
    };

    const exportData = (format: "json" | "csv") => {
        const data = eventStore.userEvents.map((event) => ({
            ...event,
            createdAt: dayjs(event.createdAt).format(FORMAT_VIEW_DATE),
        }));

        const content =
            format === "json"
                ? JSON.stringify(data, null, 2)
                : data
                    .map((row) =>
                        Object.values(row)
                            .map((field) => `"${field}"`)
                            .join(",")
                    )
                    .join("\n");

        const blob = new Blob([content], { type: format === "json" ? "application/json" : "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `audit-log.${format}`;
        link.click();
    };

    useEffect(() => {
        const settingUser = JSON.parse(window.localStorage.getItem('user_settings')!);
        setSettings(settingUser);

        eventStore.getAllEvents().finally(() => {
            eventStore.setLoadingEvents(false);
        });
    }, []);

    return (
        <PageContainerControlPanel>
            <PageHeader
                title="Журнал аудита"
                showBottomDivider
                buttonTitle="Обновить"
                onClickButton={handleRefresh}
            />
            <div className="flex items-center justify-between mb-4">
                <Input
                    placeholder="Поиск по событиям..."
                    value={searchText}
                    onChange={handleSearch}
                    prefix={<SearchOutlined />}
                    style={{ width: "300px" }}
                />
                <div className="flex gap-2">
                    <Button type="primary" icon={<DownloadOutlined />} onClick={() => exportData("json")}>
                        Скачать JSON
                    </Button>
                    <Button type="default" icon={<DownloadOutlined />} onClick={() => exportData("csv")}>
                        Скачать CSV
                    </Button>
                </div>
            </div>
            <Table
                size={(settings && settings.table_size) ?? "middle"}
                footer={settings && settings.show_footer_table ? (table) => <div>Общее количество: {table.length}</div> : undefined}
                pagination={{ pageSize: Number((settings && settings.pagination_size) ?? 5) }}
                dataSource={filteredData.length > 0 ? filteredData : eventStore.userEvents}
                columns={columns}
                loading={eventStore.loadingEvents}
                rowHoverable={false}
                rowKey={(record) => record.id}
                rowClassName={(record) =>
                    record.success ? "bg-green-100" : "bg-red-100"
                }
                expandable={{
                    expandedRowRender: (record) => (
                        <div style={{ padding: "10px 20px", background: "#fafafa", borderRadius: "8px" }}>
                            <p><strong>Дата и время:</strong> {dayjs(record.createdAt).format(FORMAT_VIEW_DATE)}</p>
                            <p><strong>Событие:</strong> {record.action}</p>
                            <p><strong>Описание:</strong> {record.description || "Нет описания"}</p>
                            <p><strong>Статус:</strong> {record.success ? "Успешно" : "Неуспешно"}</p>
                            <p><strong>Пользователь:</strong> {record.user.first_name} ({record.user.email})</p>

                            <hr style={{ margin: "20px 0", borderColor: "#e8e8e8" }} />
                            <h4 style={{ marginBottom: "10px" }}>Дополнительная информация:</h4>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                                {[
                                    { label: "IP-адрес", value: "192.168.1.1" },
                                    { label: "Локация", value: "Москва, Россия" },
                                    { label: "Тип устройства", value: "Desktop" },
                                    { label: "Операционная система", value: "Windows 10" },
                                    { label: "Браузер", value: "Google Chrome v.112.0" },
                                    { label: "Роль пользователя", value: "Администратор" },
                                    { label: "Двухфакторная аутентификация", value: "Включена" },
                                    { label: "Текущая сессия", value: "Активна" },
                                    { label: "ID транзакции", value: "TXN123456789" },
                                    { label: "Время обработки", value: "120 мс" },
                                    { label: "HTTP метод", value: "POST" },
                                    { label: "Код ответа", value: "200 OK" },
                                    { label: "Размер запроса", value: "1.2 KB" },
                                    { label: "Размер ответа", value: "3.4 KB" },
                                    { label: "Источник запроса", value: "https://example.com/login" },
                                    { label: "Токен доступа", value: "Bearer abcdefgh123456" },
                                    { label: "Статус токена", value: "Действителен" },
                                    { label: "Дата окончания сессии", value: "2025-01-30 15:34:12" },
                                    { label: "Реферал", value: "https://referral.example.com" },
                                    { label: "ID пользователя", value: record.user.id },
                                    { label: "Версия API", value: "v1.0" },
                                    { label: "Скорость сети", value: "100 Mbps" },
                                    { label: "Уровень привилегий", value: "Высокий" },
                                    { label: "Результат верификации", value: "Успешно" },
                                    { label: "Комментарий администратора", value: "Все данные проверены." },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            flex: "1 1 calc(33.333% - 16px)",
                                            padding: "10px",
                                            background: "#fff",
                                            borderRadius: "6px",
                                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        <p style={{ marginBottom: "5px", fontWeight: "bold", color: "#595959" }}>
                                            {item.label}
                                        </p>
                                        <p style={{ margin: 0, color: "#262626" }}>{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                    rowExpandable: (record) => !!record, // Делаем строку раскрываемой только если есть данные
                }}
            />
        </PageContainerControlPanel>
    );
};

export default observer(EventPage);
