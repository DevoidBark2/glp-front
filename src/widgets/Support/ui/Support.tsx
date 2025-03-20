import React, { useState } from "react"
import { Button, Form, Input, Modal, Result } from "antd"

import { SupportItem } from "@/shared/api/support/model"

export const SupportBlock = () => {
    const [form] = Form.useForm<SupportItem>()
    const [openModal,setOpenModal] = useState<boolean>(false);

    const onCancelModal = () => setOpenModal(false);

    const handleSubmit = (values: SupportItem) => {
        setOpenModal(true);
        form.resetFields();
    }

    return (
        <>
            <Modal
                open={openModal}
                onCancel={onCancelModal}
                footer={null}
            >
                <Result
                    status="success"
                    title="Письмо успешно отправлено!"
                    subTitle="Спасибо за обращение в службу поддержки. Наши специалисты свяжутся с вами в ближайшее время по указанному в сообщении адресу электронной почты."
                    extra={[
                        <Button key="close_modal" onClick={onCancelModal}>Закрыть</Button>,
                    ]}
                />
            </Modal>

            <h1 className="mt-6 text-3xl font-semibold text-gray-800 mb-6">Поддержка</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Как мы можем вам помочь?
                </h2>

                <Form
                    form={form}
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="email"
                        rules={[{required: true, message: "Email обязательно!"},
                            {type: "email", message: "Неверный формат email!"}
                        ]}
                    >
                        <Input
                            placeholder="Введите ваш email для ответа"
                        />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        rules={[{required: true, message: "Содержимое обязательно!"}]}
                    >
                        <Input.TextArea
                            placeholder="Пожалуйста, введите здесь свое сообщение или вопрос..."
                        />
                    </Form.Item>


                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="ml-2">Отправить</Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    )
}