import {Button, Form, Input, Modal} from "antd";
import React, {FC} from "react";

interface CreateCategoryModalProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    handleSubmit: (values: any) => Promise<void>
}

export const CreateCategoryModal: FC<CreateCategoryModalProps> = ({ openModal, setOpenModal, handleSubmit }) => {
    const [form] = Form.useForm();
    return (
        <Modal
            open={openModal}
            onCancel={() => {
                form.resetFields();
                setOpenModal(false);
            }}
            title={"Добавление категории"}
            footer={null}
        >
            <Form
                form={form}
                onFinish={(values) => handleSubmit(values).then(() => {
                    form.resetFields()
                })}
            >
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: "Название категории обязательно!" }]}
                >
                    <Input placeholder="Название категории" />
                </Form.Item>

                <div className="flex items-center justify-end">
                    <Form.Item>
                        <Button type="default" onClick={() => {
                            form.resetFields();
                            setOpenModal(false)
                        }}>
                            Отменить
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="ml-2">Добавить</Button>
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    )
}