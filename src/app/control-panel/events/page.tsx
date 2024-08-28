"use client"
import Link from "next/link";
import {Button, Divider, Table, TableColumnsType, Tooltip, Tag, Input, DatePicker} from "antd";
import React, {useEffect, useState} from "react";
import {observer} from "mobx-react";
import {useMobxStores} from "@/stores/stores";
import {EventUser} from "@/stores/EventStore";
import {ReloadOutlined, SearchOutlined, UserOutlined} from "@ant-design/icons";
import {eventColors, eventTooltips, FORMAT_VIEW_DATE} from "@/constants";
import {MAIN_COLOR} from "@/constants";
import {ActionEvent} from "@/enums/ActionEventUser";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const EventPage = () => {
    const {eventStore} = useMobxStores();
    const [searchText, setSearchText] = useState<string>("");
    const [filteredData, setFilteredData] = useState<EventUser[]>([]);

    const columns: TableColumnsType<EventUser> = [
        {
            dataIndex: "action",
            title: "Событие",
            filters: Object.keys(eventColors).map((key) => ({
                text: (
                    <Tooltip title={eventTooltips[key as ActionEvent] || "Описание недоступно"}>
                        <Tag color={eventColors[key as ActionEvent]}>{key}</Tag>
                    </Tooltip>
                ),
                value: key,  // Здесь используется строковое название события
            })),
            onFilter: (value, record) => record.action === value,
            render: (value,record) => {
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
            dataIndex: "createdAt",
            title: "Создано",
            sorter: (a,b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
            render: (value) => dayjs(value).format(FORMAT_VIEW_DATE)
        },
        {
            dataIndex: "user",
            title: "Пользователь",
            render: (value, record) => (
                <div>
                    <UserOutlined style={{ marginRight: 8, color: MAIN_COLOR, fontSize: "18px" }} />
                    <Link
                        href={`/control-panel/users/${record.user.id}`}
                        className="hover:text-black"
                    >
                        {record.user.name}
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
                    (val) =>
                        typeof val === "string" &&
                        val.toLowerCase().includes(value)
                )
            )
        );
    };

    useEffect(() => {
        eventStore.getAllEvents().finally(() => {
            eventStore.setLoadingEvents(false)
        });
    }, []);

    return (
        <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto" style={{height: 'calc(100vh - 60px)'}}>
            <div className="flex items-center justify-between">
                <h1 className="text-green-800 font-bold text-3xl mb-2">Пользовательские события</h1>
                <Button icon={<ReloadOutlined/>} onClick={handleRefresh}>
                    Обновить
                </Button>
            </div>
            <Divider/>
            <div className="flex items-center justify-between mb-4">
                <Input
                    placeholder="Поиск по событиям..."
                    value={searchText}
                    onChange={handleSearch}
                    prefix={<SearchOutlined/>}
                    style={{width: "300px"}}
                />
                <RangePicker />
            </div>
            <Table
                dataSource={eventStore.userEvents}
                columns={columns}
                loading={eventStore.loadingEvents}
                pagination={{pageSize: 10}}
                rowKey={(record) => record.id}
                rowClassName={(record, index) =>
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }
            />
        </div>
    )
}

export default observer(EventPage);
