import {Button, Form, Input, Modal} from "antd";
import React, {FC, useEffect} from "react";

import {NomenclatureItem} from "@/shared/api/nomenclature/model";

interface ChangeCategoryModalProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    handleSubmit: (values: any) => Promise<void>
    initialValue: NomenclatureItem | null
}

export const ChangeCategoryModal: FC<ChangeCategoryModalProps> = ({ openModal, setOpenModal, handleSubmit, initialValue }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (openModal && initialValue) {
            form.setFieldsValue({ id: initialValue.id, name: initialValue.name });
        }
    }, [openModal, initialValue]);

    return (
        <Modal
            open={openModal}
            onCancel={() => {
                form.resetFields();
                setOpenModal(false);
            }}
            title={"Изменение категории"}
            footer={null}
        >
            <Form
                form={form}
                onFinish={(values) => handleSubmit(values).then(() => {
                    form.resetFields()
                    setOpenModal(false);
                })}
                initialValues={{ id: initialValue?.id, name: initialValue?.name }}
            >
                <Form.Item name="id" hidden></Form.Item>
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: "Название категории обязательно!" }]}
                >
                    <Input placeholder="Название категории" />
                </Form.Item>

                <div className="flex items-center justify-end">
                    <Form.Item>
                        <Button color="blue" variant="solid" onClick={() => {
                            form.resetFields();
                            setOpenModal(false)
                        }}>
                            Отменить
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button color="blue" variant="solid" htmlType="submit" className="ml-2">Изменить</Button>
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    )
}