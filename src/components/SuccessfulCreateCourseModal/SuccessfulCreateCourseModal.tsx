import { Button, Modal, Result } from "antd";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface SuccessfulCreateCourseModalProps {
    openModal: boolean;
    onCancel: () => void;
}

const SuccessfulCreateCourseModal: FC<SuccessfulCreateCourseModalProps> = ({ openModal, onCancel }) => {
    const router = useRouter();
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
                    <Button type="primary" onClick={() => router.push('/control-panel/sections/add')}> Перейти к созданию</Button>,
                    <Button onClick={onCancel}>Закрыть</Button>,
                ]}
            />
        </Modal>
    );
}

export default SuccessfulCreateCourseModal;