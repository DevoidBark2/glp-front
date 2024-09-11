"use client"
import {Button, Divider, Popconfirm, Table, TableColumnsType, Tag, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import {SectionCourseItem} from "@/stores/SectionCourse";
import {observer} from "mobx-react";
import dayjs, {Dayjs} from "dayjs";
import {useMobxStores} from "@/stores/stores";
import {FORMAT_VIEW_DATE, statusCourses} from "@/constants";
import {isEditedCourse} from "@/selectors/courseSelectors";
import {
    DeleteOutlined,
    EditOutlined, MinusCircleOutlined,
    MoreOutlined,
    OrderedListOutlined,
    PlusCircleOutlined, UnorderedListOutlined,
    UploadOutlined
} from "@ant-design/icons";
import {useRouter} from "next/navigation";
import {StatusCourseEnum} from "@/enums/StatusCourseEnum";
import {showCourseStatus} from "@/utils/showCourseStatusInTable";

const SectionPage = () => {
    const {sectionCourseStore} = useMobxStores();
    const router = useRouter();

    // Функция для группировки по курсу
    const groupSectionsByCourse = () => {
        const groupedData = sectionCourseStore.sectionCourse.reduce((acc, section) => {
            const course = section.course;
            if (!acc[course.id]) {
                acc[course.id] = {
                    course,
                    sections: [],
                };
            }
            acc[course.id].sections.push(section);
            return acc;
        }, {});
        return Object.values(groupedData);
    };

    const [groupedByCourse, setGroupedByCourse] = useState(false);
    // Группированные данные
    const groupedData = groupSectionsByCourse();
    const [isGrouped, setIsGrouped] = useState(false);
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
                    <Tooltip title={groupedByCourse ? "Разгруппировать" : "Сгруппировать по курсам"} className="ml-2">
                        <Button
                            type="primary"
                            icon={groupedByCourse ? <MinusCircleOutlined /> : <PlusCircleOutlined />}
                            onClick={() => setGroupedByCourse(!groupedByCourse)}
                        >
                            {groupedByCourse ? "Разгруппировать" : "Сгруппировать"}
                        </Button>
                    </Tooltip>
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
                dataSource={groupedByCourse ? groupedData : sectionCourseStore.sectionCourse}
                expandable={
                    groupedByCourse
                        ? {
                            expandedRowRender: (courseRecord) => (
                                <Table
                                    rowKey="id"
                                    dataSource={courseRecord.sections}
                                    columns={columns.filter(col => col.dataIndex !== 'course')}
                                    pagination={false}
                                />
                            ),
                            expandIcon: ({ expanded, onExpand, record }) =>
                                expanded ? (
                                    <MinusCircleOutlined onClick={(e) => onExpand(record, e)} />
                                ) : (
                                    <PlusCircleOutlined onClick={(e) => onExpand(record, e)} />
                                ),
                            rowExpandable: (record) => record.sections && record.sections.length > 0,
                        }
                        : undefined
                }
                pagination={false}
            />
        </div>
    )
}

export default observer(SectionPage);