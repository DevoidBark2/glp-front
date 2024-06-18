"use client"
import {Button, Form, Input, Modal, notification, Table, TableColumnsType, UploadProps} from "antd";
import {observer} from "mobx-react";
import {useMobxStores} from "@/stores/stores";
import React, {useEffect, useState} from "react";
import {Post} from "@/stores/PostStore";
import Image from "next/image"
import {convertTimeFromStringToDate} from "@/app/constans";
import TextArea from "antd/es/input/TextArea";
import {InboxOutlined} from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";

type LayoutType = Parameters<typeof Form>[0]['layout'];

const columns: TableColumnsType = [
    {
        title: 'Картинка',
        dataIndex: 'image',
        key: 'image',
        width: '20%',
        render: (value:any,record:Post) => {
            return <Image src={`http://localhost:5000${record.image}`} width={200} height={200} alt={record.name}/>
        }
    },
    {
        title: 'Заголовок',
        dataIndex: 'name',
        width: '20%',
        key: 'name',
    },
    {
        dataIndex: 'publish_date',
        key: 'publish_date',
        width: '20%',
        title: 'Дата публикации',
        sorter: (a: { publish_date: string }, b: { publish_date: string }) => {
            return convertTimeFromStringToDate(a.publish_date).getTime() - convertTimeFromStringToDate(b.publish_date).getTime();
        }
    },
    {
        title: "Действия",
        width: '20%',
        align: 'center' as const,
        render: (_:any, record:any) => (
            <div>
                <Button type="default">Изменить</Button>
                <Button danger type="primary" style={{marginLeft:'20px'}} >
                    Удалить
                </Button>
            </div>
        ),
    },

];



const PostPage = () => {

    const {postStore} = useMobxStores();
    const [formLayout] = useState<LayoutType>('vertical');
    const [form] = Form.useForm()

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        onChange(info:any) {
            const { status } = info.file;
            if (status === 'done') {
                notification.success({message: `${info.file.name} file uploaded successfully.`});
                form.setFieldValue("image",info.file)
            } else if (status === 'error') {
                notification.error({message: `${info.file.name} file upload failed.`});
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };


    useEffect(() => {
        postStore.getAllPosts()
    },[])
    return(
        <div className="bg-white h-full p-5">
            <Modal
                open={postStore.createPostModal}
                onCancel={() => postStore.setCreatePostModal(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout={formLayout}
                    onFinish={postStore.createPost}
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
                        <TextArea/>
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Изображение поста"
                    >
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                                banned files.
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
            <div>
                <Button className="mb-5" type="primary" onClick={() => postStore.setCreatePostModal(true)}>Добавить пост</Button>
            </div>
            <Table dataSource={postStore.allPosts} columns={columns} loading={postStore.loading}/>
        </div>
    )
}

export default observer(PostPage);