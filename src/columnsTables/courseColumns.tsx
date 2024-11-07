import { UserHoverCard } from "@/components/PostPage/UserHoverCard";
import { FORMAT_VIEW_DATE, MAIN_COLOR, statusCourseLabels, statusCourses } from "@/constants";
import { StatusCourseEnum } from "@/enums/StatusCourseEnum";
import { UserRole } from "@/enums/UserRoleEnum";
import { isEditedCourse } from "@/selectors/courseSelectors";
import { Course } from "@/shared/api/course/model";
import { showCourseStatus } from "@/utils/showCourseStatusInTable";
import { CrownOutlined, DeleteOutlined, EditOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Popover, TableColumnsType, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import Link from "next/link";

interface getCourseColumnsProps {
    publishCourse: (id: number) => void;
    forwardCourse: (id: number) => void;
    deleteCourse: (id: number) => void;
    currentUser: any
}

export const getCourseColumns = ({ publishCourse, forwardCourse, deleteCourse, currentUser }: getCourseColumnsProps): TableColumnsType<Course> => [
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
        title: 'Дата создания',
        dataIndex: 'publish_date',
        sorter: (a, b) => dayjs(a.publish_date).valueOf() - dayjs(b.publish_date).valueOf(),
        showSorterTooltip: false,
        render: (value) => (
            <Tooltip title="Дата создания курса">
                {dayjs(value).format(FORMAT_VIEW_DATE)}
            </Tooltip>
        ),
    },
    {
        title: "Статус",
        dataIndex: "status",
        filters: Object.keys(statusCourses).map((key) => ({
            text: <Tag color={statusCourses[key as StatusCourseEnum]}>{statusCourseLabels[key as StatusCourseEnum]}</Tag>,
            value: key,
        })),
        onFilter: (value, record) => record.status === value,
        filterSearch: true,
        render: (value) => showCourseStatus(value),
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
        title: "Создатель",
        dataIndex: "user",
        hidden: currentUser?.user.role !== UserRole.SUPER_ADMIN,
        render: (_, record) => (
            record.user.role === UserRole.SUPER_ADMIN ? (
                <Link href={`/control-panel/profile`} className="hover:text-yellow-500">
                    <Tooltip title="Перейти в профиль">
                        <Tag icon={<CrownOutlined />} color="gold" style={{ marginRight: 8 }}>
                            Администратор
                        </Tag>
                    </Tooltip>
                </Link>
            ) : (
                <Popover content={<UserHoverCard user={record.user} />} title="Краткая информация" trigger="hover">
                    <UserOutlined style={{ marginRight: 8, color: MAIN_COLOR, fontSize: "18px" }} />
                    <Link href={`/control-panel/users/${record.user.id}`} className="hover:text-blue-500">
                        {`${record.user.second_name} ${record.user.first_name} ${record.user.last_name}`}
                    </Link>
                </Popover>
            )
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
                        onClick={() => publishCourse(record.id)}
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
                        onClick={() => forwardCourse(record.id)}
                        icon={<EditOutlined />}
                    />
                </Tooltip>
                <Tooltip title="Удалить курс">
                    <Popconfirm
                        title="Удалить курс?"
                        placement="leftBottom"
                        description="Вы уверены, что хотите удалить этот курс? Это действие нельзя будет отменить."
                        onConfirm={() => deleteCourse(record.id)}
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
