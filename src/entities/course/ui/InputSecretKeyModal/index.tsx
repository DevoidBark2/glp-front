import { Input, Modal, Button, Typography } from "antd";
import React, { useState } from "react";

const { Title, Text } = Typography;

interface IInputSecretKeyModalProps {
    inputSecretKeyModal: boolean;
    setInputSecretKeyModal: (val: boolean) => void;
    handleCheckSecretKey: (secret_key: string) => void
}

export const InputSecretKeyModal: React.FC<IInputSecretKeyModalProps> = ({ inputSecretKeyModal, setInputSecretKeyModal, handleCheckSecretKey }) => {
    const [secretKey, setSecretKey] = useState("")
    return (
        <Modal
            open={inputSecretKeyModal}
            onCancel={() => setInputSecretKeyModal(false)}
            centered
            footer={null}
        >
            <div className="text-center space-y-4 flex flex-col items-center justify-center">
                <Title level={4}>Введите код доступа</Title>
                <Text type="secondary">
                    Для доступа к этому курсу вам необходимо ввести 8-значный код.
                </Text>

                <Input.OTP length={8} className="mt-2" onChange={(value) => setSecretKey(value)} />

                <div className="flex justify-center w-full">
                    <Button
                        color="default"
                        variant="solid"
                        onClick={() => handleCheckSecretKey(secretKey)}
                        className="mt-4 w-full max-w-[300px]"
                    >
                        Подтвердить
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
