import { FILTER_STATUS_COMPONENT_COURSE, FILTER_TYPE_COMPONENT_COURSE, FORMAT_VIEW_DATE } from "@/constants";
import { CourseComponentTypeI } from "@/stores/CourseComponent";
import { Button, Popconfirm, TableColumnsType, Tag, Tooltip } from "antd";
import {
    BookOutlined,
    CheckCircleOutlined,
    CodeOutlined,
    DeleteOutlined,
    EditOutlined,
    ProjectOutlined,
    ReconciliationOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { CourseComponentType } from "@/shared/api/course/model";
import { StatusComponentTaskEnum } from "@/shared/api/component-task";

export const typeIcons = {
    [CourseComponentType.Text]: <BookOutlined style={{ color: '#1890ff' }} />,
    [CourseComponentType.Quiz]: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    [CourseComponentType.Coding]: <CodeOutlined style={{ color: '#ff4d4f' }} />,
    [CourseComponentType.MultiPlayChoice]: <ProjectOutlined style={{ color: '#faad14' }} />,
    [CourseComponentType.Matching]: <ReconciliationOutlined style={{ color: '#2f54eb' }} />,
    [CourseComponentType.Sequencing]: <EditOutlined style={{ color: '#13c2c2' }} />,
};


interface TaskColumnsProps {
    handleChangeComponent: (record: CourseComponentTypeI) => void,
    handleDeleteComponent: (recordId: number) => void

}

export const taskColumns = ({ handleChangeComponent, handleDeleteComponent }: TaskColumnsProps): TableColumnsType<CourseComponentTypeI> => [
    {
        title: 'Название',
        dataIndex: 'title',
        width: "20%",
        render: (text, record) => (
            <Tooltip title={text ? `Перейти к редактированию: ${text}` : 'Название не указано'}>
                <p
                    className="cursor-pointer"
                    onClick={() => handleChangeComponent(record)}
                    style={{ color: !text ? 'grey' : "black" }}
                >
                    {text?.length > 30 ? `${text.slice(0, 30)}...` : text ?? 'Название не указано'}
                </p>
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
        onFilter: (value, record) => record.status.startsWith(value as string),
        render: (status) => (
            <Tag color={status === StatusComponentTaskEnum.ACTIVATED ? 'green' : 'red'}>
                {status === StatusComponentTaskEnum.ACTIVATED ? 'Активен' : 'Неактивен'}
            </Tag>
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
                        onClick={() => handleChangeComponent(record)}
                    />
                </Tooltip>
                <Popconfirm
                    title="Удалить компонент?"
                    description="Вы уверены, что хотите удалить этот компонент? Это действие нельзя будет отменить."
                    okText="Да"
                    onConfirm={() => handleDeleteComponent(record.id)}
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