"use client";
import Link from "next/link";
import { Table, TableColumnsType, Tooltip, Tag, Input, Button } from "antd";
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
            render: (success) => success ? (
                    <Tag color="green">
                        <CheckCircleOutlined style={{ marginRight: 4 }} />
                        Успех
                    </Tag>
                ) : (
                    <Tag color="red">
                        <CloseCircleOutlined style={{ marginRight: 4 }} />
                        Неуспех
                    </Tag>
                ),
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

    const exportData = (format: "json") => {
        const data = eventStore.userEvents.map((event) => ({
            ...event,
            createdAt: dayjs(event.createdAt).format(FORMAT_VIEW_DATE),
        }));

        const content = JSON.stringify(data, null, 2)

        const blob = new Blob([content], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `audit-log.json`;
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
                </div>
            </div>
            <Table
                size={(settings && settings.table_size) ?? "middle"}
                footer={settings && settings.show_footer_table ? (table) => <div>Общее количество: {table.length}</div> : undefined}
                pagination={{ pageSize: Number((settings && settings.pagination_size) ?? 5) }}
                dataSource={filteredData.length > 0 ? filteredData : eventStore.userEvents}
                columns={columns}
                loading={eventStore.loadingEvents}
                rowKey={(record) => record.id}
                expandable={{
                    expandedRowRender: (record) => (
                        <div style={{ padding: "10px 20px", background: "#fafafa", borderRadius: "8px" }}>
                            <p><strong>Дата и время:</strong> {dayjs(record.createdAt).format(FORMAT_VIEW_DATE)}</p>
                            <p><strong>Событие:</strong> {record.action}</p>
                            <p><strong>Описание:</strong> {record.description || "Нет описания"}</p>
                            <p><strong>Статус:</strong> {record.success ? "Успешно" : "Неуспешно"}</p>
                            <p><strong>Пользователь:</strong> {`${record.user.second_name} ${record.user.first_name} ${record.user.last_name}`} ({record.user.email})</p>
                        </div>
                    )
                }}
            />
        </PageContainerControlPanel>
    );
};

export default observer(EventPage);
