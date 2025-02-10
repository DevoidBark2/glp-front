import { Course, StatusCourseEnum } from "@/shared/api/course/model";
import {UserRole} from "@/shared/api/user/model";
import { coursesTable } from "@/shared/config/tableConfig";
import { FORMAT_VIEW_DATE, MAIN_COLOR, statusCourseLabels, statusCourses } from "@/shared/constants";
import {Button, Popconfirm, Popover, Table, TableColumnsType, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { observer } from "mobx-react";
import Link from "next/link";
import { CrownOutlined, DeleteOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import {useEffect, useState} from "react";
import {UserHoverCard} from "@/widgets";
import { isEditedCourse } from "../../selectors";
import {SettingControlPanel} from "@/shared/model";
import {useMobxStores} from "@/shared/store/RootStore";
import {showCourseStatus} from "@/shared/lib/showCourseStatusInTable";

export const CourseControlList = observer(() => {
    const { courseStore, userProfileStore } = useMobxStores()
    const router = useRouter();
    const [settings, setSettings] = useState<SettingControlPanel | null>(null);

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
            title: 'Дата создания',
            dataIndex: 'created_at',
            sorter: (a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf(),
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
            hidden: userProfileStore.userProfile?.role !== UserRole.SUPER_ADMIN,
            render: (_, record) => (
                record.user?.role === UserRole.SUPER_ADMIN ? (
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
                        <Link href={`/control-panel/users/${record.user?.id}`} className="hover:text-blue-500">
                            {`${record.user?.second_name} ${record.user?.first_name} ${record.user?.last_name}`}
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
                    <Button
                        type="default"
                        shape="circle"
                        disabled={isEditedCourse(record) && userProfileStore.userProfile?.role !== UserRole.SUPER_ADMIN}
                        onClick={() => router.push(`courses/${record.id}`)}
                        icon={<EditOutlined />}
                    />
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
                                disabled={isEditedCourse(record) && userProfileStore.userProfile?.role !== UserRole.SUPER_ADMIN}
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
        const settingUser = JSON.parse(window.localStorage.getItem('user_settings')!);
        setSettings(settingUser);
       
        courseStore.getCoursesByUser()

        return () => {
            courseStore.setSuccessCreateCourseModal(false)
        }
    }, [])
    return (
        <Table
            size={(settings && settings.table_size) ?? "middle"}
            footer={settings && settings.show_footer_table ? (table) => <div>Общее количество: {table.length}</div> : undefined}
            pagination={{ pageSize: Number((settings && settings.pagination_size) ?? 5) }}
            rowKey={(record) => record.id}
            loading={courseStore.loadingCourses}
            dataSource={courseStore.userCourses}
            columns={columns}
            locale={coursesTable}
        />
    )
})