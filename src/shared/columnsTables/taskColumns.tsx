import React from "react";
import { Button, Popconfirm, Popover, TableColumnsType, Tag, Tooltip } from "antd";
import {
    BookOutlined,
    CheckCircleOutlined,
    CodeOutlined,
    CrownOutlined,
    DeleteOutlined,
    EditOutlined,
    ProjectOutlined,
    ReconciliationOutlined,
    UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import Link from "next/link";

import { FILTER_STATUS_COMPONENT_COURSE, FILTER_TYPE_COMPONENT_COURSE, FORMAT_VIEW_DATE, MAIN_COLOR } from "@/shared/constants";
import { UserRole } from "@/shared/api/user/model";
import { UserHoverCard } from "@/widgets";
import {CourseComponentType, StatusCourseComponentEnum} from "@/shared/api/component/model";
import {UserProfile} from "@/entities/user-profile/model/UserProfileStore";
import {ComponentTask} from "@/shared/api/course/model";

export const typeIcons = {
    [CourseComponentType.Text]: <BookOutlined style={{ color: '#1890ff' }} />,
    [CourseComponentType.Quiz]: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    [CourseComponentType.Coding]: <CodeOutlined style={{ color: '#ff4d4f' }} />,
    [CourseComponentType.MultiPlayChoice]: <ProjectOutlined style={{ color: '#faad14' }} />,
    [CourseComponentType.Matching]: <ReconciliationOutlined style={{ color: '#2f54eb' }} />,
    [CourseComponentType.Sequencing]: <EditOutlined style={{ color: '#13c2c2' }} />,
    [CourseComponentType.SimpleTask]: <EditOutlined style={{ color: '#13c2c2' }} />,
};


interface TaskColumnsProps {
    handleChangeComponentById: (id: string) => void,
    handleDeleteComponentById: (id: string) => void,
    currentUser: UserProfile | null
}

export const taskColumns = ({ handleChangeComponentById, handleDeleteComponentById, currentUser }: TaskColumnsProps): TableColumnsType<ComponentTask> => [
    {
        title: 'Название',
        dataIndex: 'title',
        width: "20%",
        render: (text, record) => (
            <Tooltip title={text ? `Перейти к редактированию: ${text}` : 'Название не указано'}>
                <button
                    className="cursor-pointer"
                    onClick={() => handleChangeComponentById(record.id)}
                    style={{ color: !text ? 'grey' : "black" }}
                >
                    {text?.length > 30 ? `${text.slice(0, 30)}...` : text ?? 'Название не указано'}
                </button>
            </Tooltip>
        ),
    },
    {
        title: "Тип",
        dataIndex: "type",
        filters: FILTER_TYPE_COMPONENT_COURSE,
        onFilter: (value, record) => record.type.startsWith(value as string),
        render: (value, record) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Tag icon={typeIcons[record.type]}>
                    <span style={{ marginLeft: 8 }}>{value}</span>
                </Tag>
            </div>
        ),
    },
    {
        title: "Дата создания",
        dataIndex: "created_at",
        showSorterTooltip: false,
        sorter: (a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf(),
        render: (_, record) => dayjs(record.created_at).format(FORMAT_VIEW_DATE)
    },
    {
        title: "Статус",
        dataIndex: "status",
        filters: FILTER_STATUS_COMPONENT_COURSE,
        onFilter: (value, record) => record.status === value,
        render: (status) => (
            <Tag color={status === StatusCourseComponentEnum.ACTIVATED ? 'green' : 'red'}>
                {status === StatusCourseComponentEnum.ACTIVATED ? 'Активен' : 'Неактивен'}
            </Tag>
        ),
    },
    {
        title: "Создатель",
        dataIndex: "user",
        hidden: currentUser?.role !== UserRole.SUPER_ADMIN,
        render: (_, record) => record.user?.role === UserRole.SUPER_ADMIN ? (
                <Link href={`/control-panel/profile`} className="hover:text-yellow-500">
                    <Tooltip title="Перейти в профиль">
                        <Tag icon={<CrownOutlined />} color="gold" style={{ marginRight: 8 }}>
                            Администратор
                        </Tag>
                    </Tooltip>
                </Link>
            ) : (
                <Popover content={<UserHoverCard user={record.user!} />} title="Краткая информация" trigger="hover">
                    <UserOutlined style={{ marginRight: 8, color: MAIN_COLOR, fontSize: "18px" }} />
                    <Link href={`/control-panel/users/${record.user?.id}`} className="hover:text-blue-500">
                        {`${record.user?.second_name ?? ''} ${record.user?.first_name ?? ''} ${record.user?.last_name ?? ''}`}
                    </Link>
                </Popover>
            ),
    },
    {
        title: "Действия",
        align: 'start',
        render: (_, record) => (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Tooltip title="Редактировать компонент">
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => handleChangeComponentById(record.id)}
                    />
                </Tooltip>
                <Popconfirm
                    title="Удалить компонент?"
                    description="Вы уверены, что хотите удалить этот компонент? Это действие нельзя будет отменить."
                    okText="Да"
                    onConfirm={() => handleDeleteComponentById(record.id)}
                    cancelText="Нет"
                >
                    <Button
                        danger
                        type="primary"
                        icon={<DeleteOutlined />}
                    />
                </Popconfirm>
            </div>
        )
    },
];