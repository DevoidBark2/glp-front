import React from "react"
import { AutoComplete, Button, Form, Input, Table, TableColumnsType, Tooltip } from "antd"
import {
    BookOutlined,
    CheckCircleOutlined,
    CodeOutlined,
    ProjectOutlined,
    ReconciliationOutlined, EditOutlined, DeleteOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { FormInstance } from "antd/lib";
import {observer} from "mobx-react";

import { useMobxStores } from "@/shared/store/RootStore";
import { CourseComponent, CourseComponentType } from "@/shared/api/component/model";
import {renderType} from "@/shared/lib/course/course.lib";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { DragHandle, Row } from "@/entities/course/ui";

interface SelectComponentProps {
    createSectionForm: FormInstance
}

export const SelectComponent = observer(({ createSectionForm }: SelectComponentProps) => {
    const { courseComponentStore } = useMobxStores();

    const handleSearch = (value: string) => {
        if (value && value.length > 2) {
            courseComponentStore.searchComponents(value);
        }
    };

    const typeIcons = {
        [CourseComponentType.Text]: <BookOutlined style={{ color: '#1890ff' }} />,
        [CourseComponentType.Quiz]: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        [CourseComponentType.Coding]: <CodeOutlined style={{ color: '#ff4d4f' }} />,
        [CourseComponentType.MultiPlayChoice]: <ProjectOutlined style={{ color: '#faad14' }} />,
        [CourseComponentType.Matching]: <ReconciliationOutlined style={{ color: '#2f54eb' }} />,
        [CourseComponentType.Sequencing]: <EditOutlined style={{ color: '#13c2c2' }} />,
    };

    const handleDelete = (record: CourseComponent) => {
        courseComponentStore.removeComponentFromTable(record.id)
        const currentComponents = createSectionForm.getFieldValue('components') || [];
        const updatedComponents = currentComponents.filter((component: CourseComponent) => component.id !== record.id);
        createSectionForm.setFieldsValue({ components: updatedComponents });
    }

    const handleSelect = (value: string, option: any) => {
        const selectedComponent = courseComponentStore.searchResults.find(component => component.id === option.key);

        if (selectedComponent) {
            // Добавляем компонент в store
            courseComponentStore.addComponentToTableForSection(selectedComponent);

            // Получаем текущие компоненты из формы (массив объектов)
            const currentComponents = createSectionForm.getFieldValue('components') || [];

            // Добавляем новый объект компонента в массив
            const updatedComponents = [...currentComponents, selectedComponent];

            // Обновляем форму с полным массивом объектов
            createSectionForm.setFieldsValue({ components: updatedComponents });
        }
    };

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over || active.id === over.id) return;
    
        const currentComponents = [...courseComponentStore.selectedComponents];
        const activeIndex = currentComponents.findIndex((record) => record.id === active.id);
        const overIndex = currentComponents.findIndex((record) => record.id === over.id);
    
        const updatedComponents = arrayMove(currentComponents, activeIndex, overIndex).map((component, index) => ({
            ...component,
            sort: index + 1,
        }));
    
        courseComponentStore.setSelectedComponent(updatedComponents);
        createSectionForm.setFieldsValue({ components: updatedComponents });
    };    


    const columns: TableColumnsType<CourseComponent> = [
        { key: "sort", align: "center", width: 80, render: () => <DragHandle /> },
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (text: string, record) => (
                <Tooltip title={`Перейти к компоненту: ${text}`}>
                    <Link href={`/control-panel/components/${record.id}`} target="__blank">
                        {text}
                    </Link>
                </Tooltip>
            ),
        },
        {
            title: 'Тип',
            dataIndex: 'type',
            key: 'type',
            render: (value, record) => (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    {typeIcons[record.type]}
                    <span style={{ marginLeft: 8 }}>{value}</span>
                </span>
            ),
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => <div className="flex justify-end">
                <Button icon={<DeleteOutlined/>} type="primary" danger onClick={() => handleDelete(record)}/>
            </div>
        },
    ];

    return  <div className="flex flex-col lg:flex-row">
    <div className="w-full mb-4 lg:w-1/4 lg:mb-0">
        <AutoComplete
            style={{ width: '100%' }}
            onSearch={handleSearch}
            onSelect={handleSelect}
            options={
                courseComponentStore.searchResults.length > 0
                    ? courseComponentStore.searchResults.map(component => ({
                        value: component.title,
                        label: (
                            <div className="flex items-center p-2 border-b-2">
                                <div style={{ flex: 1 }}>
                                    <strong>{component.title}</strong>
                                    <div style={{ color: 'grey', fontSize: '12px' }}>{component.description}</div>
                                </div>
                                <div style={{ marginLeft: '8px' }}>
                                    {renderType(component.type)}
                                </div>
                            </div>
                        ),
                        key: component.id.toString(),
                    }))
                    : [
                        {
                            value: 'empty',
                            label: <div style={{ textAlign: 'center', padding: '8px', color: 'grey' }}>Empty</div>,
                            disabled: true,
                        },
                    ]
            }
            placeholder="Введите название..."
        >
            <Input.Search />
        </AutoComplete>

    </div>
    <div className="w-full">
        <Form.Item
            name="components"
            label=" Компоненты"
            tooltip={{ title: "Выберите и добавьте компоненты раздела в таблицу. Эти компоненты будут связаны с текущим разделом." }}
        >
            <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                <SortableContext
                    items={courseComponentStore.selectedComponents.map((comp) => comp.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <Table
                        dataSource={courseComponentStore.selectedComponents.map((comp) => ({ ...comp, key: comp.id }))}
                        columns={columns}
                        rowKey={(record) => record.id}
                        components={{ body: { row: Row } }}
                    />
                </SortableContext>
            </DndContext>
        </Form.Item>
    </div>
</div>

})