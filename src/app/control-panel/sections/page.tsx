"use client"
import {Button, Divider, Popconfirm, Table, TableColumnsType, Tooltip} from "antd";
import React, {useEffect} from "react";
import Link from "next/link";
import {SectionCourseItem} from "@/stores/SectionCourse";
import {observer} from "mobx-react";
import dayjs, {Dayjs} from "dayjs";
import {useMobxStores} from "@/stores/stores";
import {FORMAT_VIEW_DATE, statusCourses} from "@/constants";
import {
    DeleteOutlined,
    EditOutlined,
    MoreOutlined,
    PlusCircleOutlined,
    UploadOutlined
} from "@ant-design/icons";

const SectionPage = () => {
    const {sectionCourseStore} = useMobxStores();
    const columns: TableColumnsType<SectionCourseItem> = [
        {
            title: 'Заголовок',
            dataIndex: 'name',
            width: '20%',
            ellipsis: true,
            render: (text) => (
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
            render: (_, record) => {
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
            render: (date: Dayjs) => dayjs(date).format(FORMAT_VIEW_DATE)
        },
        {
            title: "Статус",
            dataIndex: "status",
            render: (value) => value
        },
        {
            title: "Действия",
            key: 'actions',
            width: '20%',
            align: 'center',
            render: (_, record) => (
                <div className="flex justify-end gap-2">
                    <Tooltip title="Опубликовать">
                        <Button type="default" icon={<UploadOutlined />} />
                    </Tooltip>
                    <Tooltip title="Редактировать раздел">
                        <Button type="default" shape="circle" icon={<EditOutlined />} />
                    </Tooltip>
                    <Tooltip title="Удалить раздел">
                        <Popconfirm
                            title="Удалить раздел?"
                            placement="leftBottom"
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button danger type="primary" icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </div>
            ),
        },
    ];

    useEffect(() => {
        sectionCourseStore.getAllSectionCourse();
    }, []);
    return (
        <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto" style={{height: 'calc(100vh - 60px)'}}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <h1 className="text-gray-800 font-bold text-3xl mb-2">Доступные разделы</h1>
                </div>
                <div>
                    <Link href={"sections/add"}>
                        <Button
                            className="flex items-center justify-center transition-transform transform hover:scale-105"
                            type="primary"
                            icon={<PlusCircleOutlined/>}
                        >
                            Добавить раздел
                        </Button>
                    </Link>
                    <Button className="ml-2" icon={ <MoreOutlined />}/>
                </div>
            </div>
            <Divider/>
            <Table
                rowKey={(record) => record.course?.id || record.id}
                loading={sectionCourseStore.loadingSectionsCourse}
                columns={columns}
                dataSource={sectionCourseStore.sectionCourse}
                pagination={{pageSize: 10}}
            />
        </div>
    )
}

export default observer(SectionPage);