import { Form, Input } from "antd"
import dynamic from "next/dynamic"
import 'react-quill/dist/quill.snow.css';
const ReactQuill = dynamic(
    () => import('react-quill'),
    { ssr: false }
)

export const TextTask = () => {
    return (
        <>
            <Form.Item
                name="title"
                label="Заголовок"
                tooltip="Укажите заголовок, чтобы легко идентифицировать компонент, относящийся к разделу."
            >
                <Input placeholder="Введите заголовок" />
            </Form.Item>

            <Form.Item
                name="content_description"
                label="Содержание"
                rules={[{ required: true, message: "Пожалуйста, введите содержание!" }]}
            >
                <ReactQuill theme="snow" />
            </Form.Item>
        </>
    )
}