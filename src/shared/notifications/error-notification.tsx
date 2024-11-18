import { App } from "antd";

// export const errorNotification = (
//     message: string,
//     description?: string
// ) => {
//     const { notification } = App.useApp();
//     notification.error({
//         message: message,
//         description: description,
//     });
// };


interface errorNotificationProps {
    message: string;
    description?: string
}

export const errorNotification = ({ message, description }: errorNotificationProps) => {
    const { notification } = App.useApp();
    return notification.error({
        message: message,
        description: description,
    });
}