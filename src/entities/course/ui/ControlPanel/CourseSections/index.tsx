import { typeIcons } from "@/columnsTables/taskColumns";
import { StatusCourseComponentEnum } from "@/shared/api/component/model"
import { FORMAT_VIEW_DATE } from "@/shared/constants"
import { useMobxStores } from "@/shared/store/RootStore";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
    Button,
    Divider,
    Empty,
    InputNumber,
    notification,
    Popconfirm,
    Table,
    TableColumnsType,
    Tag,
    Tooltip
} from "antd"
import dayjs from "dayjs";
import { observer } from "mobx-react"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import {ParentSection, SectionCourseItem} from "@/shared/api/section/model";

export const CourseSections = observer(() => {
    const { courseStore, sectionCourseStore } = useMobxStores()
    const router = useRouter()


    const handleChangeSection = (id: number) => {
        router.push(`/control-panel/sections/${id}`)
    }

    const handleDeleteSection = (id: number) => {
        sectionCourseStore.deleteSection(id).then(response => {
            courseStore.courseDetailsSections.filter(it => it.id !== id);
            notification.success({ message: response.message });
        });
    }

    const handleDeleteComponent = (sectionId: number, id: string) => {

    }

    const handleSortChange = (value: number, record: SectionCourseItem) => {
        if (value < 0) return;

        // Обновляем sort_number у текущего элемента
        const updatedSections = [...courseStore.courseDetailsSections].map((section) =>
            section.id === record.id ? {...section, sort_number: value} : section
        );

        // Сортируем по новому значению sort_number
        updatedSections.sort((a, b) => (a.sort_number || 0) - (b.sort_number || 0));

        // Обновляем store
        courseStore.setCourseDetailsSections(updatedSections);

        // Отправляем изменения на бэкенд
        // courseStore.updateSectionSortOrder({
        //     sectionId: record.id,
        //     sort_number: value
        // }).catch((e) => {
        //     notification.error({message: e.response?.data?.message || "Ошибка обновления сортировки"});
        // });
    }
    const handleDragDropComponent = (result: any, record: SectionCourseItem) => {
        if (!result.destination) return;

        const sectionId = record.id;
        const updatedComponents = Array.from(record.sectionComponents);
        const [movedComponent] = updatedComponents.splice(result.source.index, 1);
        updatedComponents.splice(result.destination.index, 0, movedComponent);

        updatedComponents.forEach((component, index) => {
            component.sort = index;
        });

        courseStore.updateSectionComponentsOrder(sectionId, updatedComponents);

        courseStore.updateComponentOrder(sectionId, updatedComponents.map((comp, index) => ({
            id: comp.id,
            sort: index
        }))).catch((e) => {
            notification.error({ message: e.response.data.message });
        });
    }

    const groupedSections = courseStore.courseDetailsSections.reduce((acc, section) => {
        const parentTitle = section.parentSection?.title || "Без родителя";

        if (!acc[parentTitle]) {
            acc[parentTitle] = [];
        }

        acc[parentTitle].push(section);
        return acc;
    }, {} as Record<string, SectionCourseItem[]>);

    const parentColumns: TableColumnsType<SectionCourseItem> = [
        {
            title: 'Сортировка',
            dataIndex: 'sort_number',
            key: 'sort_number',
            sorter: (a, b) => (a.sort_number || 0) - (b.sort_number || 0),
            width: '10%',
            render: (_, record) => {
                debugger
                return <strong>{record.sort_number ?? "—"}</strong>
            },
        },
        {
            title: 'Родительский раздел',
            dataIndex: 'parentTitle',
            key: 'parentTitle',
            width: '30%',
            render: (title) => {
                debugger
                return <strong>{title}</strong>
            },
        },
    ];

    const sectionColumns: TableColumnsType<SectionCourseItem> = [
        {
            title: 'Сортировка',
            dataIndex: 'sort_number',
            key: 'sort_number',
            sorter: (a, b) => (a.sort_number || 0) - (b.sort_number || 0),
            width: '10%',
            render: (_, record) => (
                <InputNumber min={0} value={record.sort_number || 0} onChange={(value) => handleSortChange(value, record)} />
            ),
        },
        {
            title: 'Название раздела',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            width: '30%',
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            width: '40%',
            render: (description) =>
                description?.length > 30 ? `${description.slice(0, 30)}...` : description || <span className="text-gray-400">Нет описания</span>,
        },
        {
            title: 'Дата создания',
            dataIndex: 'created_at',
            key: 'created_at',
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
            width: '20%',
            render: (date) => <Tooltip title="Время создания">{dayjs(date).format(FORMAT_VIEW_DATE)}</Tooltip>,
        },
    ];


    return (
        <div className="p-2">
            {Object.keys(groupedSections).length > 0 ? (
                <Table
                    dataSource={Object.keys(groupedSections)
                        .map((parentTitle) => ({
                            key: parentTitle,
                            parentTitle,
                            sections: groupedSections[parentTitle],
                        }))
                        .sort((a, b) => a.parentTitle.localeCompare(b.parentTitle))}
                    columns={parentColumns}
                    bordered
                    rowKey={(record) => record.key}
                    pagination={{pageSize: 20}}
                    expandable={{
                        expandedRowRender: (parentRecord) => (
                            <Table
                                dataSource={parentRecord.sections
                                    .map((section) => ({
                                        ...section,
                                        key: section.id,
                                    }))
                                    .sort((a, b) => (a.sort_number || 0) - (b.sort_number || 0))}
                                columns={sectionColumns}
                                rowKey={(record) => record.key}
                                pagination={false}
                                expandable={{
                                    expandedRowRender: (section) =>
                                        section.sectionComponents.length > 0 ? (
                                            <DragDropContext
                                                onDragEnd={(result) => handleDragDropComponent(result, section)}>
                                                <Droppable droppableId={`droppable-${section.id}`}>
                                                    {(provided) => (
                                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                                            {section.sectionComponents.map((component, index) => (
                                                                <Draggable key={component.id}
                                                                           draggableId={String(component.id)}
                                                                           index={index}>
                                                                    {(provided) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow mb-2"
                                                                        >
                                                                            <div
                                                                                className="flex items-center justify-between">
                                                                                <h4 className="font-medium text-xl text-gray-800 mb-2">
                                                                                    {component.componentTask.title || "Нет заголовка"}
                                                                                </h4>
                                                                                <Button
                                                                                    icon={<DeleteOutlined/>}
                                                                                    type="primary"
                                                                                    danger
                                                                                    onClick={() => handleDeleteComponent(component.id, component.componentTask?.id)}
                                                                                />
                                                                            </div>
                                                                            <div className="text-sm text-gray-500">
                                                                            <span className="block mb-1">
                                                                                Тип:
                                                                                <Tag className="ml-2"
                                                                                     icon={typeIcons[component.componentTask.type]}>
                                                                                    <span>{component.componentTask.type}</span>
                                                                                </Tag>
                                                                            </span>
                                                                                <span className="block mb-1">
                                                                                Статус:
                                                                                <Tag
                                                                                    color={component.componentTask.status === StatusCourseComponentEnum.ACTIVATED ? "green" : "red"}>
                                                                                    {component.componentTask.status === StatusCourseComponentEnum.ACTIVATED ? "Активен" : "Неактивен"}
                                                                                </Tag>
                                                                            </span>
                                                                                <span>Создано: {dayjs(component.componentTask.created_at).format(FORMAT_VIEW_DATE)}</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </DragDropContext>
                                        ) : (
                                            <span className="text-gray-500">Нет компонентов</span>
                                        ),
                                }}
                            />
                        ),
                    }}
                />
            ) : (
                <Empty
                    description={
                        <div>
                            <p>Список пуст</p>
                            <Link href="/control-panel/sections/add">
                                <Button className="mt-2 transition-transform transform hover:scale-105" type="primary"
                                        icon={<PlusCircleOutlined/>}>
                                    Создать раздел
                                </Button>
                            </Link>
                        </div>
                    }
                />
            )}
        </div>
    )
})