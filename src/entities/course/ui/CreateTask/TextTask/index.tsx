import React, { useState } from "react";
import { Form, Input } from "antd";
import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {EditorState} from "draft-js";

// Динамически загружаем компонент Editor
const Editor = dynamic(
    () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
    { ssr: false } // Отключаем серверный рендеринг
);

export const TextTask = () => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const handleEditorChange = (state: any) => {
        setEditorState(state);
    };

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
                <div className="editor-container">
                    <Editor
                        editorState={editorState}
                        onEditorStateChange={handleEditorChange}
                    />
                </div>
            </Form.Item>
        </>
    );
};
