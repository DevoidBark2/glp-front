import { Form, Input } from "antd"
import TextArea from "antd/es/input/TextArea"

export const General = () => {
    return {
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
        )
    }
}