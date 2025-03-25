import React from "react";
import { Form, Input, Modal } from "antd"
import { observer } from "mobx-react"

import { Faq } from "@/shared/api/faq/model"

interface FaqModalProps {
    editingItem: Faq,
    openModal: (faq: Faq) => void,
    closeModal: () => void,
    handleAddOrUpdate: (faq: Faq) => void
}
 
export const FaqModal = observer(({editingItem,openModal,closeModal,handleAddOrUpdate}: FaqModalProps) => {
    const [form] = Form.useForm();
    return (
        <Modal
            title={editingItem ? "Редактировать вопрос" : "Добавить новый вопрос"}
            // open={openModal}
            onCancel={closeModal}
            onOk={() => form.submit()}
            okText={editingItem ? "Сохранить" : "Добавить"}
        >
            <Form form={form} layout="vertical" onFinish={handleAddOrUpdate}>
                <Form.Item name="id" hidden></Form.Item>
                <Form.Item
                    name="question"
                    label="Вопрос"
                    rules={[{ required: true, message: "Пожалуйста, введите вопрос" }]}
                >
                    <Input placeholder="Введите вопрос" />
                </Form.Item>
                <Form.Item
                    name="answer"
                    label="Ответ"
                    rules={[{ required: true, message: "Пожалуйста, введите ответ" }]}
                >
                    <Input.TextArea rows={4} placeholder="Введите ответ" />
                </Form.Item>
            </Form>
        </Modal>
    )
})