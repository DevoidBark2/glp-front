"use client"
import PageContainerControlPanel from "@/components/PageContainerControlPanel/PageContainerControlPanel"
import { Course, CourseComponentType, CourseComponentTypeI } from "@/shared/api/course/model"
import { useMobxStores } from "@/stores/stores"
import { AutoComplete, Badge, Breadcrumb, Button, Card, Divider, Empty, Form, Input, List, message, notification, Steps, Table, TableColumnsType, Tag, Tooltip } from "antd"
import TextArea from "antd/es/input/TextArea"
import { observer } from "mobx-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
    ClockCircleOutlined,
    BookOutlined,
    CheckCircleOutlined,
    CodeOutlined,
    ProjectOutlined,
    ReconciliationOutlined, EditOutlined, PlusCircleOutlined, ExportOutlined
} from "@ant-design/icons";

const SectionDetailsPage = () => {
    const { courseStore, courseComponentStore, sectionCourseStore, generalSettingsStore } = useMobxStores();
    const [createSectionForm] = Form.useForm();
    const [current, setCurrent] = useState(0);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const router = useRouter();

    const handleSelectCourse = (course: Course) => {
        setSelectedCourseId(course.id);
        createSectionForm.setFieldsValue({ course: course });
    };

    const handleForwardComponent = (record: CourseComponentTypeI) => {
        { `/control-panel/tasks/${record.id}` }
    }

    const columns: TableColumnsType<CourseComponentTypeI> = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (text: string, record) => (
                <Tooltip title={`Перейти к компоненту: ${text}`}>
                    <p onClick={() => handleForwardComponent(record)}>
                        {text}
                    </p>
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
                <Button onClick={() => {
                    courseComponentStore.removeComponentFromTable(record.id)
                    const currentComponents = createSectionForm.getFieldValue('components') || [];

                    // Создаем новый массив, исключив из него удаляемый компонент
                    const updatedComponents = currentComponents.filter((component: CourseComponentTypeI) => component.id !== record.id);

                    // Обновляем значение в форме
                    createSectionForm.setFieldsValue({ components: updatedComponents });
                }}>Удалить</Button>
            ),
        },
    ];

    const typeIcons = {
        [CourseComponentType.Text]: <BookOutlined style={{ color: '#1890ff' }} />,
        [CourseComponentType.Quiz]: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        [CourseComponentType.Coding]: <CodeOutlined style={{ color: '#ff4d4f' }} />,
        [CourseComponentType.MultiPlayChoice]: <ProjectOutlined style={{ color: '#faad14' }} />,
        [CourseComponentType.Matching]: <ReconciliationOutlined style={{ color: '#2f54eb' }} />,
        [CourseComponentType.Sequencing]: <EditOutlined style={{ color: '#13c2c2' }} />,
    };
    const handleSearch = (value: string) => {
        if (value && value.length > 2) {
            courseComponentStore.searchComponents(value);
        }
    };

    const handleSelect = (value: string, option: any) => {
        const selectedComponent = courseComponentStore.searchResults.find(component => component.id === parseInt(option.key));
        if (selectedComponent) {
            courseComponentStore.addComponentToTable(selectedComponent);
            const currentComponents = createSectionForm.getFieldValue('components') || [];

            // Добавляем новый компонент к текущим
            const updatedComponents = [...currentComponents, selectedComponent];

            // Обновляем значение в форме
            createSectionForm.setFieldsValue({ components: updatedComponents });
        }
    };

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

    const renderLevelCourse = (levelCourse: number) => {
        switch (levelCourse) {
            case 0:
                return "Легкий";
            case 1:
                return "Средний";
            case 2:
                return "Сложный";
            default:
                return <Tag color="default">Неизвестно</Tag>;
        }
    }

    const steps = [
        {
            title: "Выбор курса",
            content: (
                <Form.Item
                    name="courseId"
                >
                    <List
                        locale={{
                            emptyText: <Empty description="Список пуст">
                                <Button
                                    className="flex items-center justify-center transition-transform transform hover:scale-105"
                                    type="primary"
                                    icon={<PlusCircleOutlined />}
                                    onClick={() => router.push('/control-panel/courses/add')}
                                >
                                    Создать курс
                                </Button>
                            </Empty>
                        }}
                        grid={{ gutter: 16, column: 5 }}
                        loading={courseStore.loadingCourses}
                        dataSource={courseStore.userCourses}
                        renderItem={(item) => (
                            <List.Item>
                                <Badge text={item.status}>
                                    <Card
                                        key={item.id}
                                        title={<div className="flex justify-between">
                                            <p>{item.name}</p>
                                            <Button
                                                icon={<ExportOutlined />}
                                                title="Перейти к курсу"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    router.push(`/control-panel/courses/${item.id}`)
                                                }}
                                            />
                                        </div>}
                                        hoverable
                                        onClick={() => handleSelectCourse(item)}
                                        style={{
                                            width: 240,
                                            margin: 8,
                                            border: selectedCourseId === item.id ? '2px solid #1890ff' : '2px solid #f0f0f0',
                                            backgroundColor: selectedCourseId === item.id ? '#e6f7ff' : '#fff',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        <Card.Meta
                                            description={
                                                <div>
                                                    <p><ClockCircleOutlined /> {item.duration} ч.</p>
                                                    <p>Категория: {item.category?.name ?? "Категория отсутствует"}</p>
                                                    <p>Уровень: {renderLevelCourse(item.level)}</p>
                                                    <p>Дата публикации: {new Date(item.publish_date).toLocaleDateString()}</p>
                                                </div>
                                            }
                                            style={{ textAlign: 'left' }}
                                        />
                                    </Card>
                                </Badge>
                            </List.Item>
                        )}
                    />
                </Form.Item>
            ),
        },
        {
            title: "Информация о разделе",
            content: (
                <>
                    <Form.Item
                        name="name"
                        label="Название раздела"
                        rules={[{ required: true, message: "Введите название раздела!" }]}
                    >
                        <Input placeholder="Введите название раздела..." />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Описание раздела"
                    >
                        <TextArea
                            placeholder="Введите описание раздела..."
                            autoSize={{ minRows: 3, maxRows: 6 }}
                        />
                    </Form.Item>

                    {/* {generalSettingsStore.generalSettings?.allow_extra_materials && <>
                        <Form.Item
                            name="uploadFile"
                            label="Дополнительные материалы"
                            tooltip="Загрузите дополнительные материалы (PDF, документы и т.д.)"
                        >
                            <Upload beforeUpload={() => false}>
                                <Button icon={<UploadOutlined />}>Загрузить файл</Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            label="Ссылки на внешние ресурсы"
                            tooltip="Добавьте ссылки на связанные внешние ресурсы"
                        >
                            <Form.List name="externalLinks">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <div key={key} className="flex items-center mb-4">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name]}
                                                    rules={[{ type: 'url', message: 'Введите корректный URL' }]}
                                                    style={{ flexGrow: 1 }}
                                                >
                                                    <Input placeholder="Введите URL" />
                                                </Form.Item>
                                                <Button
                                                    type="link"
                                                    onClick={() => remove(name)}
                                                    icon={<DeleteOutlined />}
                                                    danger
                                                />
                                            </div>
                                        ))}
                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                style={{ width: '100%' }}
                                                icon={<PlusOutlined />}
                                            >
                                                Добавить ссылку
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Form.Item>
                    </>} */}
                </>
            ),
        },
        {
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
    ];

    const next = async () => {
        if (current === 0 && !selectedCourseId) {
            message.warning("Выберите курс!")
            return;
        }

        if (current === 1) {
            await createSectionForm.validateFields(["name", "description"]);
            setCurrent(current + 1);
        } else {
            setCurrent(current + 1);
        }
    };
    const prev = () => setCurrent(current - 1);

    const onFinish = () => {
        const values = createSectionForm.getFieldsValue(true)
        if (!values.components || values.components.length === 0) {
            message.warning("Добавь хотя бы один компонент в раздел!")
            return;
        }
        sectionCourseStore.addSection(values).then((response) => {
            router.push("/control-panel/sections");
            notification.success({ message: response.message })
            courseComponentStore.setSearchResult([]);
            courseComponentStore.setSelectedComponent([]);
            sectionCourseStore.setCreateSectionLoading(false);
        })
    };


    return (
        <PageContainerControlPanel>
            <Breadcrumb
                items={[
                    {
                        title: <Link href={"/control-panel/sections"}>Доступные разделы</Link>,
                    },
                    {
                        title: <span>Новый раздел</span>,
                    },
                ]}
            />
            <h1 className="text-center text-3xl mb-5">Изменение раздела</h1>
            <Divider />
            <Form form={createSectionForm} onFinish={onFinish} layout="vertical">
                <Steps current={current}>
                    {steps.map((item) => (
                        <Steps.Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <div className="steps-content mt-5">{steps[current].content}</div>
                <div className="steps-action mt-5 flex justify-end">
                    {current > 0 && (
                        <Button style={{ marginRight: 8 }} onClick={() => prev()}>
                            Назад
                        </Button>
                    )}
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => next()}>
                            Далее
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" htmlType="submit" loading={sectionCourseStore.createSectionLoading}>
                            Подтвердить и создать
                        </Button>
                    )}
                </div>
            </Form>
        </PageContainerControlPanel>
    )
}

export default observer(SectionDetailsPage);