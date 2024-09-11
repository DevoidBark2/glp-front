"use client";
import {observer} from "mobx-react";
import {
    Button,
    Divider,
    Dropdown,
    Empty,
    MenuProps,
    Modal,
    Popconfirm, Result,
    Table,
    TableColumnsType,
    Tag,
    Tooltip
} from "antd";
import React, {useEffect} from "react";
import {useMobxStores} from "@/stores/stores";
import Link from "next/link";
import {Course} from "@/stores/CourseStore";
import {FORMAT_VIEW_DATE, statusCourses} from "@/constants";
import {showCourseStatus} from "@/utils/showCourseStatusInTable";
import {StatusCourseEnum} from "@/enums/StatusCourseEnum";
import {DeleteOutlined, EditOutlined, MoreOutlined, PlusCircleOutlined, UploadOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {isEditedCourse} from "@/selectors/courseSelectors";
import {useRouter} from "next/navigation";
import {coursesTable, paginationCount} from "@/tableConfig/coursesTable";

const CoursesPage = () => {
    const {courseStore} = useMobxStores()
    const router = useRouter();
    const columns: TableColumnsType<Course> = [
        {
            title: 'Название',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            showSorterTooltip: false,
            render: (value, record) => (
                <Tooltip title={`Перейти к курсу: ${value}`}>
                    <Link className="text-gray-800 hover:text-gray-500 hover:cursor-pointer" href={`courses/${record.id}`}>
                        {value}
                    </Link>
                </Tooltip>
            ),
        },
        {
            title: 'Дата публикации',
            dataIndex: 'publish_date',
            sorter: (a, b) => dayjs(a.publish_date).valueOf() - dayjs(b.publish_date).valueOf(),
            showSorterTooltip: false,
            render: (value) => (
                <Tooltip title="Дата публикации курса">
                    {dayjs(value).format(FORMAT_VIEW_DATE)}
                </Tooltip>
            ),
        },
        {
            title: "Статус",
            dataIndex: "status",
            filters: Object.keys(statusCourses).map((key) => ({
                text: <Tag color={statusCourses[key as StatusCourseEnum]}>{key}</Tag>,
                value: key,
            })),
            onFilter: (value, record) => record.status === value,
            filterSearch: true,
            render: (value) => showCourseStatus(value)
        },
        {
            dataIndex: "duration",
            title: "Кол-во часов, ч.",
            sorter: (a, b) => a.duration - b.duration,
            showSorterTooltip: false,
            render: (value) => (
                <Tooltip title="Длительность курса в часах">
                    {value}
                </Tooltip>
            ),
        },
        {
            title: "Действия",
            align: 'start',
            render: (_, record) => (
                <div className="flex justify-end gap-2">
                    <Tooltip title={
                        !isEditedCourse(record)
                            ? "Опубликовать курс"
                            : "В данный момент курс не может быть опубликован, попробуйте позже"
                    }>
                        <Button
                            onClick={() => courseStore.publishCourse(record.id)}
                            disabled={isEditedCourse(record)}
                            type="default"
                            icon={<UploadOutlined />}
                        />
                    </Tooltip>
                    <Tooltip title={isEditedCourse(record) ? "В данный момент курс нельзя изменить, попробуйте позже" : "Редактировать курс"}>
                        <Button
                            type="default"
                            shape="circle"
                            disabled={isEditedCourse(record)}
                            onClick={() => router.push(`courses/${record.id}`)}
                            icon={<EditOutlined />}
                        />
                    </Tooltip>
                    <Tooltip title="Удалить курс">
                        <Popconfirm
                            title="Удалить курс?"
                            placement="leftBottom"
                            description="Вы уверены, что хотите удалить этот курс? Это действие нельзя будет отменить."
                            onConfirm={() => courseStore.deleteCourse(record.id)}
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button
                                danger
                                disabled={isEditedCourse(record)}
                                type="primary"
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Tooltip>
                </div>
            ),
        },
    ];

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                  Удалить все курсы
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    Экспортировать
                </a>
            ),
        },
        {
            key: '3',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                    3rd menu item
                </a>
            ),
        },
    ];

    useEffect(() => {
        courseStore.getCoursesForCreator()
    }, []);

    return (
        <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto custom-height-screen">
            <Modal
                open={courseStore.successCreateCourseModal}
                onCancel={() => courseStore.setSuccessCreateCourseModal(false)}
                footer={null}
            >
                <Result
                    status="success"
                    title="Курс успешно создан!"
                    subTitle="Для успешного публикования курса необходимо создать, как минимум 1 раздел."
                    extra={[
                        <Button type="primary" onClick={() => router.push('/control-panel/sections')}> Перейти к разделам</Button>,
                        <Button onClick={() => courseStore.setSuccessCreateCourseModal(false)}>Закрыть</Button>,
                    ]}
                />
            </Modal>
            <div className="flex items-center justify-between">
                <h1 className="text-gray-800 font-bold text-3xl mb-2">Доступные курсы</h1>
                <div>
                    <Link href={"courses/add"}>
                        <Button
                            className="flex items-center justify-center transition-transform transform hover:scale-105"
                            type="primary"
                            icon={<PlusCircleOutlined/>}
                        >Добавить курс
                        </Button>
                    </Link>
                    <Dropdown menu={{ items }} placement="bottomLeft">
                        <Button className="ml-2" icon={ <MoreOutlined />}/>
                    </Dropdown>

                </div>

            </div>
            <Divider />
            <Table
                rowKey={(record) => record.id}
                loading={courseStore.loadingCourses}
                dataSource={courseStore.userCourses}
                columns={columns}
                rowSelection={{type: "checkbox"}}
                pagination={{ pageSize: paginationCount }}
                locale={coursesTable}
                bordered
            />
        </div>
    );
}

export default observer(CoursesPage);
