import { SectionCourseItem } from "@/shared/api/course/model";
import { StatusSectionEnum } from "@/shared/api/section/model";
import {FORMAT_VIEW_DATE, MAIN_COLOR} from "@/shared/constants";
import {Button, notification, Popconfirm, Popover, Table, TableColumnsType, Tag, Tooltip} from "antd"
import dayjs, { Dayjs } from "dayjs";
import { sectionsTable } from "@/shared/config";
import {
    CrownOutlined,
    DeleteOutlined,
    EditOutlined, UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {useEffect, useState} from "react";
import { observer } from "mobx-react";
import {UserRole} from "@/shared/api/user/model";
import {UserHoverCard} from "@/widgets";
import {SettingControlPanel} from "@/shared/model";
import {useMobxStores} from "@/shared/store/RootStore";

export const SectionList = observer(() => {
    const {sectionCourseStore, userProfileStore} = useMobxStores();
    const router = useRouter();
    const [settings, setSettings] = useState<SettingControlPanel | null>(null);

    const columns: TableColumnsType<SectionCourseItem> = [
        {
            title: 'Заголовок',
            dataIndex: 'name',
            width: '20%',
            ellipsis: true,
            showSorterTooltip: false,
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text) => (
                <Tooltip title={text}>
                    <span>{text.length > 50 ? `${text.slice(0, 50)}...` : text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Название курса',
            dataIndex: 'course',
            width: '20%',
            ellipsis: true,
            render: (_, record) => {
                return (
                    <Tooltip title={`Перейти к курсу "${record.course.name}"`}>
                        <Link className="text-gray-800 hover:text-gray-600" href={`courses/${record.course.id}`}>
                            {record.course.name.length > 50 ? `${record.course.name.slice(0, 50)}...` : record.course.name}
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
                { text: 'Активен', value: StatusSectionEnum.ACTIVE },
                { text: 'Неактивен', value: StatusSectionEnum.DEACTIVE }
            ],
            onFilter: (value, record) => record.status === value,
            render: (value) => {
                return value === StatusSectionEnum.ACTIVE ? (
                    <Tag color="green">Активен</Tag>
                ) : (
                    <Tag color="red">Неактивен</Tag>
                );
            }
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
            key: 'actions',
            width: '20%',
            align: 'center',
            render: (_, record) => (
                <div className="flex justify-end gap-2">
                    <Tooltip title="Редактировать раздел">
                        <Button type="default" shape="circle" icon={<EditOutlined />} onClick={() => handleEditSection(record.id)} />
                    </Tooltip>
                    <Tooltip title="Удалить раздел">
                        <Popconfirm
                            title="Удалить раздел?"
                            placement="leftBottom"
                            okText="Да"
                            onConfirm={() => handleDeleteSection(record.id)}
                            cancelText="Нет"
                        >
                            <Button danger type="primary" icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </div>
            ),
        },
    ];

    const handleEditSection = (id: number) => {
        router.push(`sections/${id}`)
    }

    const handleDeleteSection = (id: number) => {
        sectionCourseStore.deleteSection(id).then(response => {
            notification.success({message: response.message});
        })
    }

    useEffect(() => {
        const settingUser = JSON.parse(window.localStorage.getItem('user_settings')!);
        setSettings(settingUser);
        sectionCourseStore.getAllSectionCourse();
    }, []);

    return (
        <Table
            size={(settings && settings.table_size) ?? "middle"}
            footer={settings && settings.show_footer_table ? (table) => <div>Общее количество: {table.length}</div> : undefined}
            pagination={{ pageSize: Number((settings && settings.pagination_size) ?? 5) }}
            rowKey={(record) => record.id}
            loading={sectionCourseStore.loadingSectionsCourse}
            columns={columns as any}
            dataSource={sectionCourseStore.sectionCourse}
            locale={sectionsTable}
        />
    )
})