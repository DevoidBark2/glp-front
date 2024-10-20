import { NomenclatureItem } from "@/stores/NomenclatureStore";
import { Button, Form, Input, Modal } from "antd"
import { FC, useEffect } from "react"

interface ChangeCategoryModalProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    handleSubmit: (values: any) => Promise<void>
    initialValue: NomenclatureItem | null
}

const ChangeCategoryModal: FC<ChangeCategoryModalProps> = ({ openModal, setOpenModal, handleSubmit, initialValue }) => {
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
                        <Button type="default" onClick={() => {
                            form.resetFields();
                            setOpenModal(false)
                        }}>
                            Отменить
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="ml-2">Изменить</Button>
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    )
}


export default ChangeCategoryModal