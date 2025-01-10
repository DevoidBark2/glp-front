import {Input, Modal} from "antd";
import React from "react";

interface IInputSecretKeyModalProps {
    inputSecretKeyModal: boolean;
    setInputSecretKeyModal: (val: boolean) => void;
}

export const InputSecretKeyModal: React.FC<IInputSecretKeyModalProps> = ({inputSecretKeyModal, setInputSecretKeyModal}) => {
    return (
        <Modal
            open={inputSecretKeyModal}
            onCancel={() => setInputSecretKeyModal(false)}
        >
            <Input.OTP length={6}/>
        </Modal>
    )
}