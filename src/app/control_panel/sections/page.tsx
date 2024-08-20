"use client"
import {Button, Divider, Table, TableColumnsType, Tooltip} from "antd";
import React, {useEffect} from "react";
import {convertTimeFromStringToDate} from "@/app/constans";
import Link from "next/link";
import {SectionCourseItem} from "@/stores/SectionCourse";
import {observer} from "mobx-react";
import dayjs, {Dayjs} from "dayjs";
import {useMobxStores} from "@/stores/stores";

const SectionPage = () => {
    const {sectionCourseStore} = useMobxStores();

    const columns: TableColumnsType<SectionCourseItem> = [
        {
            title: 'Заголовок',
            dataIndex: 'name',
            width: '20%',
            ellipsis: true,
            render: (text: string) => (
                <Tooltip title={text}>
                    <span>{text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Курс',
            dataIndex: ['course'],
            width: '20%',
            ellipsis: true,
            render: (_, record: SectionCourseItem) => {
                return (
                    <Tooltip title={record.course.name}>
                        <Link href={`courses/${record.course.id}`} style={{ color: '#1890ff', textDecoration: 'none' }}>
                            {record.course.name}
                        </Link>
                    </Tooltip>
                );
            }
        },
        {
            title: 'Дата публикации',
            dataIndex: 'created_at',
            key: 'publish_date',
            width: '20%',
            sorter: (a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf(),
            render: (date: Dayjs) => dayjs(date).format('YYYY-MM-DD HH:mm')
        },
        {
            title: "Действия",
            width: '20%',
            align: 'center' as const,
            render: (_: any, record: SectionCourseItem) => (
                <div>
                    <Button type="default">Изменить</Button>
                    <Button danger type="primary" style={{ marginLeft: '20px' }}>
                        Удалить
                    </Button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        sectionCourseStore.getAllSectionCourse();
    }, []);
    return (
        <div className="bg-white h-full p-5">
            <div className="bg-white h-full p-5">
                <div className="flex items-center justify-between">
                    <h1 className="text-green-800 font-bold text-3xl mb-2">Доступные разделы</h1>
                    <div>
                        <Link href={"sections/add"}>
                            <Button type="primary">Добавить раздел</Button>
                        </Link>
                    </div>
                </div>
                <Divider/>
                <Table
                    loading={sectionCourseStore.loadingSectionsCourse}
                    dataSource={sectionCourseStore.sectionCourse}
                    columns={columns}
                />
            </div>
        </div>
    )
}

export default observer(SectionPage);