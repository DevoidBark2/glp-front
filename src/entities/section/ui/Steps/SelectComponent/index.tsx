import { CourseComponentType, CourseComponentTypeI } from "@/shared/api/course/model";
import { useMobxStores } from "@/stores/stores"
import { AutoComplete, Button, Form, Input, Table, TableColumnsType, Tag, Tooltip } from "antd"
import {
    BookOutlined,
    CheckCircleOutlined,
    CodeOutlined,
    ProjectOutlined,
    ReconciliationOutlined, EditOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { FormInstance } from "antd/lib";
import { observer } from "mobx-react";

interface SelectComponentProps {
    createSectionForm: FormInstance
}

export const SelectComponent = ({createSectionForm} : SelectComponentProps) => {
    const {courseComponentStore} = useMobxStores();

    const renderType = (type: CourseComponentType) => {
        switch (type) {
            case CourseComponentType.Text:
                return <Tag color="cyan">Текст</Tag>;
            case CourseComponentType.Quiz:
                return <Tag color="green">Квиз</Tag>;
            case CourseComponentType.Coding:
                return <Tag color="purple">Программирование</Tag>;
            default:
                return <Tag color="default">Неизвестно</Tag>;
        }
    };
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

    const handleDelete = (record: CourseComponentTypeI) => {
        courseComponentStore.removeComponentFromTable(record.id)
        const currentComponents = createSectionForm.getFieldValue('components') || [];
        const updatedComponents = currentComponents.filter((component: CourseComponentTypeI) => component.id !== record.id);
        createSectionForm.setFieldsValue({ components: updatedComponents });
    }

    const handleSelect = (value: string, option: any) => {
        const selectedComponent = courseComponentStore.searchResults.find(component => component.id === parseInt(option.key));
        if (selectedComponent) {
            courseComponentStore.addComponentToTable(selectedComponent);
            const currentComponentIds = createSectionForm.getFieldValue('components') || [];

            const updatedComponentIds = [...currentComponentIds, selectedComponent];

            // Обновляем значение в форме только с массивом ID
            createSectionForm.setFieldsValue({ components: updatedComponentIds });
        }
    };



    const columns: TableColumnsType<CourseComponentTypeI> = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (text: string, record) => (
                <Tooltip title={`Перейти к компоненту: ${text}`}>
                    <Link href={`/control-panel/tasks/${record.id}`} target="__blank">
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
            render: (_, record) => (
                <Button onClick={() => handleDelete(record)}>Удалить</Button>
            ),
        },
    ];
    
    return {
        title: "Содержимое раздела",
        content: (
            <div className="flex">
                <div className="w-1/4">
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
                        placeholder="Введите название или тег..."
                    >
                        <Input.Search />
                    </AutoComplete>

                </div>
                <div className="w-3/4 ml-5">
                    <Form.Item
                        name="components"
                        label=" Компоненты"
                        tooltip={{ title: "Выберите и добавьте компоненты раздела в таблицу. Эти компоненты будут связаны с текущим разделом." }}
                    >
                        <Table
                            dataSource={courseComponentStore.selectedComponents}
                            columns={columns}
                            rowKey={(record) => record.id}
                        />
                    </Form.Item>
                </div>
            </div>
        ),
    }
}