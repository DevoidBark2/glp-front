import {Button, Col, Form, Input, Modal, notification, Row, Select} from "antd"
import TextArea from "antd/es/input/TextArea"
import React, { useEffect, useState } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {observer} from "mobx-react";
import {FormInstance} from "antd/lib";

import { useMobxStores } from "@/shared/store/RootStore";
import {MainSection, SectionCourseItem} from "@/shared/api/section/model";

interface GeneralProps {
    createSectionForm: FormInstance<SectionCourseItem>
}

export const General = observer(({createSectionForm}: GeneralProps) => {
    const { sectionCourseStore } = useMobxStores();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm<MainSection>();

    const handleAddSection = (values: MainSection) => {
        sectionCourseStore.addMainSection(values).then(response => {
            notification.success({ message: response.message })
        }).finally(() => {
            setIsModalOpen(false);
        })
    };

    // const handleChange = ({ file, fileList }: {file: UploadFile<any>, fileList: UploadFile<any>[]}) => {
    //     const { status } = file;
    //
    //     if (status === "done") {
    //         createSectionForm.setFieldValue("uploadFile", file);
    //         sectionCourseStore.setUploadedImages(fileList);
    //     } else if (status === "removed") {
    //         createSectionForm.setFieldValue("uploadFile", null);
    //         sectionCourseStore.setUploadedImages(fileList);
    //     } else if (status === "error") {
    //         notification.error({ message: `${file.name} ошибка загрузки.` });
    //     }
    //
    //     sectionCourseStore.setUploadedImages(fileList);
    // };

    useEffect(() => {
        sectionCourseStore.getMainSections();
    }, [])
    return <>
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

        <Row gutter={16}>
            <Col xs={24} md={12}>
                <Form.Item
                    name="parentSection"
                    label="Выберите раздел"
                    rules={[{ required: true, message: "Выберите раздел или добавьте новый!" }]}
                >
                    <Select
                        placeholder="Выберите раздел..."
                        dropdownRender={(menu) => (
                            <>
                                {menu}
                                <div className="flex justify-between items-center p-2">
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
                        dropdownStyle={{ maxHeight: '300px', overflowY: 'auto' }}
                    >
                        {sectionCourseStore.mainSections.map((section) => (
                            <Select.Option key={section.id} value={section.id}>
                                {section.title}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>

            <Col xs={24} md={12}>
                <Form.Item
                    name="name"
                    label="Название раздела"
                    rules={[
                        { required: true, message: "Введите название раздела!" },
                        { max: 64, message: "Название раздела превышает допустимую длину 64" }
                    ]}
                >
                    <Input placeholder="Введите название раздела..." />
                </Form.Item>
            </Col>
        </Row>


        <Form.Item
            name="description"
            label="Описание раздела"
            rules={[{ required: false, message: "Введите описание раздела!" },
                { max: 100, message: "Описание раздела превышает допустимую длину 100" }
            ]}
        >
            <TextArea
                placeholder="Введите описание раздела..."
                autoSize={{ minRows: 3, maxRows: 6 }}
            />
        </Form.Item>

        {/*<Form.Item*/}
        {/*    name="uploadFile"*/}
        {/*    label="Дополнительные материалы"*/}
        {/*    tooltip="Загрузите дополнительные материалы (PDF, документы и т.д.)"*/}
        {/*>*/}
        {/*    <Upload*/}
        {/*        name="file"*/}
        {/*        beforeUpload={() => false}*/}
        {/*        multiple*/}
        {/*        fileList={sectionCourseStore.uploadedImages}*/}
        {/*        onChange={handleChange}*/}
        {/*        listType="picture"*/}
        {/*    >*/}
        {/*        <Button icon={<UploadOutlined />}>Загрузить файл</Button>*/}
        {/*    </Upload>*/}
        {/*</Form.Item>*/}

        <Form.Item
            label="Ссылки на внешние ресурсы"
            tooltip="Добавьте ссылки на связанные внешние ресурсы"
        >
            <Form.List name="externalLinks">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <div key={key} className="flex mb-4">
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
    </>
})