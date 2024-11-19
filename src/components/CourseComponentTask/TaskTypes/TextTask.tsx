import { Form, Input, Select, Tag } from "antd"
import dynamic from "next/dynamic"
const ReactQuill = dynamic(
    () => import('react-quill'),
    { ssr: false }
)
import 'react-quill/dist/quill.snow.css';


const TextTask = () => {
    return (
        <>
            <Form.Item
                name="title"
                label="Заголовок"
            >
                <Input placeholder="Введите заголовок" />
            </Form.Item>

            <Form.Item
                name="tags"
                label="Теги"
                rules={[{ required: true, message: 'Пожалуйста, добавьте хотя бы один тег!' }]}
            >
                <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="Введите тег и нажмите Enter"
                    tagRender={({ label, closable, onClose }) => (
                        <Tag closable={closable} onClose={onClose} style={{ margin: 2 }}>
                            {label}
                        </Tag>
                    )}
                />
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

export default TextTask;