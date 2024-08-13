"use client"
import Link from "next/link";
import {Button, Divider, Table, TableColumnsType, Tooltip, Tag, Input, DatePicker} from "antd";
import React, {useEffect, useState} from "react";
import {observer} from "mobx-react";
import {useMobxStores} from "@/stores/stores";
import {EventUser} from "@/stores/EventStore";
import {ReloadOutlined, SearchOutlined, UserOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {eventColors, eventTooltips} from "@/constants";
import {convertTimeFromStringToDate, MAIN_COLOR} from "@/app/constans";

const { RangePicker } = DatePicker;
const EventPage = () => {
    const {eventStore} = useMobxStores();
    const [searchText, setSearchText] = useState<string>("");
    const [filteredData, setFilteredData] = useState<EventUser[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<EventUser | null>(null);

    const columns: TableColumnsType<EventUser> = [
        {
            dataIndex: "action",
            title: "Событие",
            filters: Object.keys(eventColors).map((key) => ({
                text: (
                    <Tooltip title={eventTooltips[key] || "Описание недоступно"}>
                        <Tag color={eventColors[key]}>{key}</Tag>
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
            render: (text) => (
                <Tooltip title={text}>
                    <span>{text.length > 30 ? `${text.substring(0, 30)}...` : text}</span>
                </Tooltip>
            ),
        },
        {
            dataIndex: "createdAt",
            title: "Создано",
            sorter: (a,b) => convertTimeFromStringToDate(a.createdAt) - convertTimeFromStringToDate(b.createdAt)
        },
        {
            dataIndex: "user",
            title: "Пользователь",
            render: (value, record) => (
                <div>
                    <UserOutlined style={{ marginRight: 8, color: MAIN_COLOR, fontSize: "18px" }} />
                    <Link
                        href={`/control_panel/users/${record.user.id}`}
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

    const handleDateFilter = (dates: [dayjs.Dayjs, dayjs.Dayjs]) => {
        const [start, end] = dates;
        setFilteredData(
            eventStore.userEvents.filter((item) => {
                const eventDate = convertTimeFromStringToDate(item.createdAt);
                return eventDate >= start.valueOf() && eventDate <= end.valueOf();
            })
        );
    };

    const handleEventClick = (record: EventUser) => {
        setSelectedEvent(record);
    };

    useEffect(() => {
        eventStore.getAllEvents().finally(() => {
            eventStore.setLoadingEvents(false)
        });
    }, []);

    return (
        <div className="bg-white h-full p-5">
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
                <RangePicker onChange={(dates) => dates && handleDateFilter(dates)}/>
            </div>
            <Table
                dataSource={eventStore.userEvents}
                columns={columns}
                loading={eventStore.loadingEvents}
                pagination={{pageSize: 10}}
                rowClassName={(record, index) =>
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }
            />
        </div>
    )
}

export default observer(EventPage);
