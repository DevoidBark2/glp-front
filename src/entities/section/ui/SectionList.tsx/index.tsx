import { SectionCourseItem } from "@/shared/api/course/model";
import { StatusSectionEnum } from "@/shared/api/section/model";
import { FORMAT_VIEW_DATE } from "@/shared/constants";
import { Button, notification, Popconfirm, Table, TableColumnsType, Tag, Tooltip } from "antd"
import dayjs, { Dayjs } from "dayjs";
import { sectionsTable } from "@/shared/config";
import {
    DeleteOutlined,
    EditOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useMobxStores } from "@/stores/stores";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { observer } from "mobx-react";

export const SectionList = observer(() => {
    const {sectionCourseStore} = useMobxStores();
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
        sectionCourseStore.getAllSectionCourse();
    }, []);

    return (
        <Table
            rowKey={(record) => record.id}
            loading={sectionCourseStore.loadingSectionsCourse}
            columns={columns as any}
            dataSource={sectionCourseStore.sectionCourse}
            pagination={{ pageSize: 10 }}
            locale={sectionsTable}
        />
    )
})