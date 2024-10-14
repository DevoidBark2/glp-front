import { observer } from "mobx-react";
import Image from "next/image";
import { Modal, Button, Tooltip, Input, message } from "antd";
import { useState } from "react";

const GlobalActionComponent = ({
    handleDelete,
    handleSendNotifications,
}: {
    handleDelete: (value: any) => void;
    handleSendNotifications: (message: string) => void;
}) => {
    const [openNotificationModal, setOpenNotificationModal] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState<string>("");

    const sendNotification = () => {
        if (notificationMessage.trim() === "") {
            message.error("Введите сообщение перед отправкой.");
            return;
        }
        handleSendNotifications(notificationMessage);
        message.success("Уведомление отправлено!");
        setOpenNotificationModal(false);
        setNotificationMessage("");
    };

    return (
        <>
            <Modal
                open={openNotificationModal}
                onOk={sendNotification}
                title="Отправить уведомление"
                onCancel={() => setOpenNotificationModal(false)}
                okText="Отправить"
                cancelText="Отменить"
            >
                <Input.TextArea
                    placeholder="Введите текст уведомления..."
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    rows={4}
                />
            </Modal>

            <div className="flex items-center space-x-4">
                <Tooltip title="Массовое удаление">
                    <Image
                        src="/static/delete_icon.svg"
                        alt="Массовое удаление"
                        width={30}
                        height={30}
                        className="cursor-pointer hover:scale-110 transition-transform duration-200"
                        onClick={handleDelete}
                    />
                </Tooltip>
                <Tooltip title="Отправить уведомление">
                    <Image
                        src="/static/notification_icon.svg"
                        alt="Отправить уведомление"
                        width={30}
                        height={30}
                        className="cursor-pointer hover:scale-110 transition-transform duration-200"
                        onClick={() => setOpenNotificationModal(true)}
                    />
                </Tooltip>
            </div>
        </>
    );
};

export default observer(GlobalActionComponent);
