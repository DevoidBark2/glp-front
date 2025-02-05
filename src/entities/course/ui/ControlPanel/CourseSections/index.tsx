import { typeIcons } from "@/columnsTables/taskColumns";
import { CourseComponent, StatusCourseComponentEnum } from "@/shared/api/component/model"
import { FORMAT_VIEW_DATE } from "@/shared/constants"
import { useMobxStores } from "@/shared/store/RootStore";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Divider, Empty, notification, Popconfirm, Table, TableColumnsType, Tag, Tooltip } from "antd"
import dayjs from "dayjs";
import { observer } from "mobx-react"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"

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
        debugger
    }


    const columns: TableColumnsType<CourseComponent> = [
        {
            title: 'Название раздела',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            render: (value) => value.length > 30 ? `${value.slice(0, 30)}...` : value
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            width: '40%',
            render: (description) => {
                if (!description || description.trim().length === 0) {
                    return <span className="text-gray-400">Нет описания</span>;
                }
                return description.length > 30 ? `${description.slice(0, 30)}...` : description;
            }
        },
        {
            title: 'Дата создания',
            dataIndex: 'created_at',
            key: 'created_at',
            width: '30%',
            render: (date) => (<Tooltip title="Время создания">
                {dayjs(date).format(FORMAT_VIEW_DATE)}
            </Tooltip>)
        },
        {
            title: "Действия",
            align: 'start',
            render: (_, record) => (<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Tooltip title="Редактировать раздел">
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                    //onClick={() => handleChangeSection(record.id)}
                    />
                </Tooltip>
                <Popconfirm
                    title="Удалить компонент?"
                    description="Вы уверены, что хотите удалить этот компонент? Это действие нельзя будет отменить."
                    okText="Да"
                    //onConfirm={() => handleDeleteSection(record.id)}
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
        }];

    return (
        <div className="p-2">
            {courseStore.courseDetailsSections.length > 0 ? (<Table
                dataSource={courseStore.courseDetailsSections}
                columns={columns as any}
                bordered
                rowKey={record => record.id}
                pagination={{ pageSize: 20 }}
                expandable={{
                    expandedRowRender: (record) => {
                        debugger
                        return <div className="bg-gray-100 rounded p-4">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">Компоненты</h3>
                                <Divider />
                                {record.sectionComponents.length > 0 ? (<div
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <DragDropContext onDragEnd={() => {
                                    }}>
                                        <Droppable droppableId="droppable-list">
                                            {(provided) => (<div {...provided.droppableProps}
                                                ref={provided.innerRef}>
                                                {record.sectionComponents.map((component, index) => (
                                                    <Draggable key={component.id}
                                                        draggableId={String(component.id)}
                                                        index={index}>
                                                        {(provided) => (<div
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
                                                                    icon={<DeleteOutlined />}
                                                                    type="primary"
                                                                    danger
                                                                    onClick={() => handleDeleteComponent(component.id, component.componentTask?.id)}
                                                                />
                                                            </div>
                                                            <div
                                                                className="text-sm text-gray-500">
                                                                <span
                                                                    className="block mb-1">
                                                                    Тип:
                                                                    <Tag
                                                                        className="ml-2"
                                                                        icon={typeIcons[component.componentTask.type]}>
                                                                        <span>{component.componentTask.type}</span>
                                                                    </Tag>
                                                                </span>
                                                                <span
                                                                    className="block mb-1">
                                                                    Статус:
                                                                    <Tag
                                                                        color={component.componentTask.status === StatusCourseComponentEnum.ACTIVATED ? "green" : "red"}
                                                                    >
                                                                        {component.componentTask.status === StatusCourseComponentEnum.ACTIVATED ? "Активен" : "Неактивен"}
                                                                    </Tag>
                                                                </span>
                                                                <span>
                                                                    Создано: {dayjs(component.componentTask.created_at).format(FORMAT_VIEW_DATE)}
                                                                </span>
                                                            </div>
                                                        </div>)}
                                                    </Draggable>))}
                                                {provided.placeholder}
                                            </div>)}
                                        </Droppable>
                                    </DragDropContext>
                                </div>) : (<span className="text-gray-500">Нет компонентов</span>)}
                            </div>
                        </div>
                    }
                }}
            />) : (<Empty
                description={<div>
                    <p>Список пуст</p>
                    <Link href="/control-panel/sections/add">
                        <Button
                            className="mt-2 transition-transform transform hover:scale-105"
                            type="primary"
                            icon={<PlusCircleOutlined />}
                        >
                            Создать раздел
                        </Button>
                    </Link>
                </div>}
            />)}
        </div>
    )
})