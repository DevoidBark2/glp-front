import { Button, Form, Modal, notification, Upload, UploadFile, UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons"
import { FC } from "react";

interface CreateAvatarIconModalProps {
    showModal: boolean,
    onCancelModal: () => void;
    submitLoadingButton: boolean;
    handleSubmitForm: (values: UploadFile) => Promise<void>
}


const CreateAvatarIconModal: FC<CreateAvatarIconModalProps> = ({ showModal, onCancelModal, submitLoadingButton, handleSubmitForm }) => {
    const [form] = Form.useForm();

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            const isLessThan5MB = file.size / 1024 / 1024 < 1; // Ограничение по размеру - 5 МБ

            if (!isImage) {
                notification.error({ message: 'Можно загружать только изображения (JPEG, PNG и т.д.).' });
                return Upload.LIST_IGNORE;
            }

            if (!isLessThan5MB) {
                notification.error({ message: 'Размер файла не должен превышать 5 МБ.' });
                return Upload.LIST_IGNORE;
            }

            return true;
        },
        onChange(info: any) {
            const { status } = info.file;
            if (status === 'done') {
                notification.success({ message: `${info.file.name} загружен успешно.` });
                form.setFieldValue("image", info.file);
            } else if (status === 'error') {
                notification.error({ message: `${info.file.name} ошибка загрузки.` });
            } else if (status === "removed") {
                form.setFieldValue("image", null);
            }
        },
    };

    return (
        <Modal
            open={showModal}
            onCancel={() => {
                onCancelModal();
                form.resetFields();
            }}
            footer={null}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => handleSubmitForm(values).then(() => {
                    form.resetFields()
                })}
            >
                <Form.Item
                    name="image"
                    label={<span>Изображение</span>}
                    rules={[{ required: true, message: "Пожалуйста, выберите изображение!" }]}
                >
                    <Dragger {...props} style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '10px' }}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                        </p>
                        <p className="ant-upload-text" style={{ fontWeight: 'bold' }}>Нажмите или перетащите файл в эту область</p>
                        <p className="ant-upload-hint" style={{ color: '#8c8c8c' }}>
                            Запрещено загружать конфиденциальные данные.
                        </p>
                    </Dragger>
                </Form.Item>

                <div className="flex justify-center mt-4">
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={submitLoadingButton}
                            style={{ padding: '0 24px', borderRadius: '5px' }}
                        >
                            Создать иконку
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    )
}


export default CreateAvatarIconModal;