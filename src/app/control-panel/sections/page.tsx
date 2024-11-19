"use client"
import { Button, Popconfirm, Table, TableColumnsType, Tag, Tooltip } from "antd";
import React, { useEffect } from "react";
import Link from "next/link";
import { SectionCourseItem } from "@/stores/SectionCourse";
import { observer } from "mobx-react";
import dayjs, { Dayjs } from "dayjs";
import { useMobxStores } from "@/stores/stores";
import { FORMAT_VIEW_DATE } from "@/constants";
import {
    DeleteOutlined,
    EditOutlined,
} from "@ant-design/icons";
import PageHeader from "@/components/PageHeader/PageHeader";
import { useRouter } from "next/navigation";
import { sectionsTable } from "@/shared/config";
import { StatusSectionEnum } from "@/shared/api/section";

const SectionPage = () => {
    const { sectionCourseStore } = useMobxStores();
    const router = useRouter();

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
            title: 'Название курса',
            dataIndex: ['course'],
            width: '20%',
            ellipsis: true,
            render: (_, record) => {
                return (
                    <Tooltip title={`Перейти к курсу "${record.course.name}"`}>
                        <Link href={`courses/${record.course.id}`}>
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
            showSorterTooltip: false,
            sorter: (a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf(),
            render: (date: Dayjs) => dayjs(date).format(FORMAT_VIEW_DATE)
        },
        {
            title: "Статус",
            dataIndex: "status",
            filters: [
                { text: 'Активный', value: StatusSectionEnum.ACTIVE },
                { text: 'Не активный', value: StatusSectionEnum.DEACTIVE }
            ],
            onFilter: (value, record) => record.status === value,
            render: (value) => {
                return value === StatusSectionEnum.ACTIVE ? (
                    <Tag color="green">Активный</Tag>
                ) : (
                    <Tag color="red">Неактивный</Tag>
                );
            }
        },
        {
            title: "Действия",
            key: 'actions',
            width: '20%',
            align: 'center',
            render: (_, record) => (
                <div className="flex justify-end gap-2">
                    <Tooltip title="Редактировать раздел">
                        <Button type="default" shape="circle" icon={<EditOutlined />} onClick={() => {
                            debugger
                            console.log(record)
                        }} />
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
        <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto custom-height-screen">
            <PageHeader
                title="Доступные разделы"
                buttonTitle=" Добавить раздел"
                onClickButton={() => router.push('sections/add')}
                showBottomDivider
            />
            <Table
                rowKey={(record) => record.id}
                loading={sectionCourseStore.loadingSectionsCourse}
                columns={columns}
                dataSource={sectionCourseStore.sectionCourse}
                pagination={{ pageSize: 10 }}
                locale={sectionsTable}
            />
        </div>
    )
}

export default observer(SectionPage);