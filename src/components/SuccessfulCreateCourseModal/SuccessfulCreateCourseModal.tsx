import { Button, Modal, Result } from "antd";
import Link from "next/link";
import { FC } from "react";

interface SuccessfulCreateCourseModalProps {
    openModal: boolean;
    onCancel: () => void;
}

const SuccessfulCreateCourseModal: FC<SuccessfulCreateCourseModalProps> = ({ openModal, onCancel }) => {
    return (
        <Modal
            open={openModal}
            onCancel={onCancel}
            footer={null}
        >
            <Result
                status="success"
                title="Курс успешно создан!"
                subTitle="Для успешного публикования курса необходимо создать, как минимум 1 раздел."
                extra={[
                    <Link href="/control-panel/sections/add">
                    <Button type="primary"> Перейти к созданию</Button>
                    </Link>,
                    <Button onClick={onCancel}>Закрыть</Button>,
                ]}
            />
        </Modal>
    );
}

export default SuccessfulCreateCourseModal;