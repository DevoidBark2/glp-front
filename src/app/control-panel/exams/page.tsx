"use client"
import { Exam, ExamStatus } from "@/shared/api/exams/model";
import { UserRole } from "@/shared/api/user/model";
import { FORMAT_VIEW_DATE, MAIN_COLOR } from "@/shared/constants";
import { useMobxStores } from "@/shared/store/RootStore";
import { PageContainerControlPanel, PageHeader } from "@/shared/ui"
import { UserHoverCard } from "@/widgets";
import {Button, notification, Popconfirm, Popover, Table, TableColumnsType, Tag, Tooltip} from "antd";
import { CrownOutlined, DeleteOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {useEffect, useState} from "react";
import {observer} from "mobx-react";
import {SettingControlPanel} from "@/shared/model";

const ExamsPage = observer(() => {
    const { userProfileStore, examStore } = useMobxStores()
    const router = useRouter()
    const [settings, setSettings] = useState<SettingControlPanel | null>(null);

    const showExamStatus = (status: ExamStatus) => {
        switch (status) {
            case ExamStatus.ACTIVE:
                return "Активный"
            case ExamStatus.DEACTIVATED:
                return "Не активный"
        }
    }

    const handleDeleteExam = (id: number) => {
        examStore.deleteExam(id).then(response => {
            notification.success({message: response.message})
        })
    }

    const columns: TableColumnsType<Exam> = [
        {
            title: 'Название',
            dataIndex: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            showSorterTooltip: false,
            render: (value, record) => (
                <Tooltip title={`Перейти к курсу: ${value}`}>
                    <Link className="text-gray-800 hover:text-gray-500 hover:cursor-pointer" href={`exams/${record.id}`}>
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
                <Tooltip title="Дата создания экзамена">
                    {dayjs(value).format(FORMAT_VIEW_DATE)}
                </Tooltip>
            ),
        },
        {
            title: "Статус",
            dataIndex: "status",
            onFilter: (value, record) => record.status === value,
            filterSearch: true,
            render: (value) => showExamStatus(value),
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
                    <Tooltip title="Редактировать экзамен">
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                        />
                    </Tooltip>

                    <Tooltip title="Удалить экзамен">
                        <Popconfirm
                            title="Удалить экзамен?"
                            description="Вы уверены, что хотите удалить этот экзамен? Это действие нельзя будет отменить."
                            okText="Да"
                            cancelText="Нет"
                            onConfirm={() => handleDeleteExam(record.id)}
                        >
                            <Button
                                danger
                                type="primary"
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    </Tooltip>
                </div >
            ),
        },
    ];


    useEffect(() => {
        const settingUser = JSON.parse(window.localStorage.getItem('user_settings')!);
        setSettings(settingUser);

        examStore.getUserExams();
    }, [])
    return (
        <PageContainerControlPanel>
            <PageHeader
                title="Доступные экзамены"
                buttonTitle="Добавить экзамен"
                onClickButton={() => router.push('exams/add')}
                showBottomDivider
            />

            <Table
                size={(settings && settings.table_size) ?? "middle"}
                footer={settings && settings.show_footer_table ? (table) => <div>Общее количество: {table.length}</div> : undefined}
                pagination={{ pageSize: Number((settings && settings.pagination_size) ?? 5) }}
                columns={columns}
                dataSource={examStore.exams}
            />
        </PageContainerControlPanel>
    )
})

export default ExamsPage