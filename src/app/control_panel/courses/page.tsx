"use client";
import {observer} from "mobx-react";
import {Button, Divider, Modal, Table, TableColumnsType, Tooltip, Popconfirm} from "antd";
import React, {useEffect} from "react";
import {useMobxStores} from "@/stores/stores";
import Link from "next/link";
import {Course} from "@/stores/CourseStore";
import {FILTER_STATUS_COURSE, FORMAT_VIEW_DATE} from "@/constants";
import {showCourseStatus} from "@/utils/showCourseStatusInTable";
import {StatusCourseEnum} from "@/enums/StatusCourseEnum";
import {EditOutlined, DeleteOutlined, UploadOutlined} from "@ant-design/icons";
import dayjs from "dayjs";

const CoursesPage = () => {
    const {courseStore} = useMobxStores()

    const columns: TableColumnsType<Course> = [
        {
            title: 'Название',
            dataIndex: 'name',
            render: (text, record) => (
                <Tooltip title={`Перейти к курсу: ${text}`}>
                    <Link href={`courses/${record.id}`}>
                        {text}
                    </Link>
                </Tooltip>
            ),
        },
        {
            title: 'Дата публикации',
            dataIndex: 'publish_date',
            sorter: (a, b) => dayjs(a.publish_date).valueOf() - dayjs(b.publish_date).valueOf(),
            render: (value) => (
                <Tooltip title="Дата публикации курса">
                    {dayjs(value).format(FORMAT_VIEW_DATE)}
                </Tooltip>
            ),
        },
        {
            title: "Статус",
            dataIndex: "status",
            filters: FILTER_STATUS_COURSE,
            onFilter: (value, record) => record.status.startsWith(value as string),
            filterSearch: true,
            render: (value) => showCourseStatus(value)
        },
        {
            dataIndex: "duration",
            title: "Кол-во часов, ч.",
            sorter: (a, b) => a.duration - b.duration,
            render: (duration) => (
                <Tooltip title="Длительность курса в часах">
                    {duration}
                </Tooltip>
            ),
        },
        {
            title: "Действия",
            align: 'start',
            render: (_, record) => (
                <div className="flex justify-end">
                    {record.status === StatusCourseEnum.NEW && (
                        <Tooltip title="Опубликовать курс">
                            <Button
                                onClick={() => courseStore.publishCourse(record.id)}
                                type="default"
                                icon={<UploadOutlined />}
                                className="mr-2"
                            />
                        </Tooltip>
                    )}
                    <Tooltip title="Редактировать курс">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            className="mr-2"
                        >
                            <Link href={`courses/${record.id}`}>
                                Изменить
                            </Link>
                        </Button>
                    </Tooltip>
                    <Tooltip title="Удалить курс">
                        <Popconfirm
                            title="Удалить курс?"
                            description="Вы уверены, что хотите удалить этот курс? Это действие нельзя будет отменить."
                            onConfirm={() => courseStore.setShowConfirmDeleteCourseModal(true)}
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button
                                danger
                                type="primary"
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Tooltip>
                </div>
            ),
        },
    ];

    useEffect(() => {
        courseStore.getCoursesForCreator()
    }, []);

    return (
        <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto" style={{height: 'calc(100vh - 60px)'}}>
            <Modal
                open={courseStore.showConfirmDeleteCourseModal}
                onCancel={() => courseStore.setShowConfirmDeleteCourseModal(false)}
                title="Удаление курса"
            >
                <h1 className="text-xl"> Вы уверены, что хотите удалить курс?</h1>
            </Modal>
            <div>
                <div className="flex items-center justify-between">
                    <h1 className="text-green-800 font-bold text-3xl mb-2">Доступные курсы</h1>
                    <div>
                        <Link href={"courses/add"}>
                            <Button type="primary">Добавить курс</Button>
                        </Link>
                    </div>
                </div>
                <Divider />
                <Table
                    rowKey={(record) => record.id}
                    dataSource={courseStore.teacherCourses}
                    columns={columns}
                    rowSelection={{type: "checkbox"}}
                    loading={courseStore.loadingCourses}
                    pagination={{ pageSize: 10 }}
                    bordered
                />
            </div>
        </div>
    );
}

export default observer(CoursesPage);
