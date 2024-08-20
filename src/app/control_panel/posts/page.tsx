"use client";
import {
    Button,
    Form,
    Input,
    Modal,
    notification,
    Switch,
    Table,
    TableColumnsType,
    UploadProps,
    Card,
    Tooltip
} from "antd";
import {observer} from "mobx-react";
import {useMobxStores} from "@/stores/stores";
import React, {useEffect, useState} from "react";
import {Post} from "@/stores/PostStore";
import TextArea from "antd/es/input/TextArea";
import {
    InboxOutlined,
    PlusCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    PrinterOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";
import dayjs from "dayjs";

const PostPage = () => {
    const {postStore} = useMobxStores();
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        onChange(info: any) {
            const {status} = info.file;
            if (status === 'done') {
                notification.success({message: `${info.file.name} загружен успешно.`});
                form.setFieldValue("image", info.file);
            } else if (status === 'error') {
                notification.error({message: `${info.file.name} ошибка загрузки.`});
            }
        },
        onDrop(e) {
            console.log('Файлы перетащены', e.dataTransfer.files);
        },
    };

    const columns: TableColumnsType<Post> = [
        {
            title: 'Название',
            dataIndex: 'name',
            width: '20%',
            render: (text) => (
                <Tooltip title={text}>
                    {text}
                </Tooltip>
            ),
        },
        {
            dataIndex: 'publish_date',
            width: '20%',
            title: 'Дата публикации',
            sorter: (a, b) => dayjs(a.publish_date).valueOf() - dayjs(b.publish_date).valueOf(),
            render: (value) => <span>{dayjs(value).format('YYYY-MM-DD HH:mm')}</span>
        },
        {
            title: "Активация",
            render: (_, record) => (
                <Tooltip
                    title={
                        <span>
                        <InfoCircleOutlined style={{color: '#1890ff', marginRight: '5px'}} />
                        Включите, чтобы активировать пост.
                    </span>
                    }
                    color="#f6f6f6"
                    overlayInnerStyle={{
                        color: '#595959',
                        backgroundColor: '#e6f7ff',
                        border: '1px solid #91d5ff',
                        borderRadius: '4px',
                        padding: '8px',
                    }}
                >
                    <Switch defaultChecked={false} onChange={(checked) => console.log('Switch to:', checked)} />
                </Tooltip>
            ),
        },
        {
            title: "Действия",
            width: '20%',
            align: 'center',
            render: (_, record) => (
                <div style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
                    <Button icon={<EditOutlined />}
                            // onClick={() => postStore.editPost(record.id)}
                    >Изменить</Button>
                    <Button danger icon={<DeleteOutlined />} onClick={() => postStore.deletePost(record.id)}>Удалить</Button>
                </div>
            ),
        },

    ];

    useEffect(() => {
        postStore.getAllPosts();
    }, []);

    return (
        <div className="bg-white h-full p-5">
            <Modal
                title="Создать новый пост"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                afterClose={() => form.resetFields()}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => {
                        postStore.createPost(values);
                        setModalVisible(false);
                    }}
                >
                    <Form.Item
                        name="title"
                        label="Заголовок"
                        rules={[{required: true, message: 'Введите заголовок поста!'}]}
                    >
                        <Input placeholder="Введите название поста"/>
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="Контент поста"
                    >
                        <TextArea rows={4}/>
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Изображение поста"
                    >
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </p>
                            <p className="ant-upload-text">Нажмите или перетащите файл в эту область для загрузки</p>
                            <p className="ant-upload-hint">
                                Поддержка одиночной или массовой загрузки. Запрещено загружать конфиденциальные данные.
                            </p>
                        </Dragger>
                    </Form.Item>

                    <div className="flex flex-col items-center">
                        <Form.Item style={{marginTop: '10px'}}>
                            <Button type="primary" htmlType="submit" loading={postStore.loading}>Создать</Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-gray-800 font-bold text-3xl">Доступные посты</h1>
                <Button type="primary" icon={<PlusCircleOutlined/>} onClick={() => setModalVisible(true)}>
                    Добавить пост
                </Button>
            </div>
            <Table
                loading={postStore.loading}
                dataSource={postStore.allPosts}
                columns={columns}
                rowKey={(record) => record.id}
            />
        </div>
    );
}

export default observer(PostPage);
