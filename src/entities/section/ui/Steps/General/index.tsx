import { Button, Form, Input, message, Modal, Select } from "antd"
import TextArea from "antd/es/input/TextArea"
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useMobxStores } from "@/stores/stores";
import { MainSection } from "@/stores/SectionCourse";

export const General = () => {
    const { sectionCourseStore } = useMobxStores();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm<MainSection>();

    const handleAddSection = (values: MainSection) => {
        sectionCourseStore.addMainSection(values)

        setIsModalOpen(false);
        message.success(`Раздел "${values.title}" добавлен!`);
    };

    useEffect(() => {
        sectionCourseStore.getMainSections();
    },[])
    return {
        title: "Информация о разделе",
        content: (
            <>
            <Modal
                title="Добавить новый раздел"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={(values) => handleAddSection(values)}
                >
                    <Form.Item
                        label="Название нового раздела"
                        name="title"
                        rules={[{ required: true, message: "Введите название нового раздела!" }]}
                    >
                        <Input placeholder="Введите название нового раздела..." />
                    </Form.Item>


                    <div className="flex justify-end">
                        <Form.Item>
                            <Button onClick={() => {
                                form.resetFields();
                                setIsModalOpen(false)
                            }}>
                                Отменить
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <Button className="ml-2" type="primary" htmlType="submit">
                                Добавить
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

            <Form.Item
                name="parentSection"
                label="Выберите раздел"
                rules={[{ required: false, message: "Выберите раздел или добавьте новый!" }]}
            >
                <Select
                    placeholder="Выберите раздел..."
                    dropdownRender={(menu) => (
                        <>
                            {menu}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: 8,
                                }}
                            >
                                <Button
                                    type="text"
                                    icon={<PlusOutlined />}
                                    onClick={() => setIsModalOpen(true)}
                                    style={{ width: "100%" }}
                                >
                                    Добавить новый раздел
                                </Button>
                            </div>
                        </>
                    )}
                >
                    {sectionCourseStore.mainSections.map((section) => (
                        <Select.Option key={section.id} value={section.id}>
                            {section.title}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
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
        )
    }
}