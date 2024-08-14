"use client"
import {Breadcrumb, Button, Col, Form, notification, Row, Select, UploadProps} from "antd";
import {useMobxStores} from "@/stores/stores";
import {Input} from "antd/lib";
import {InboxOutlined} from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {observer} from "mobx-react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import Link from "next/link";
import {LEVEL_COURSE} from "@/constants";

const CourseAddPage = () => {

    const {courseStore,nomenclatureStore} = useMobxStores();
    const [createCourseForm] = Form.useForm();
    const router = useRouter();

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        onChange(info:any) {
            const { status } = info.file;
            if (status === 'done') {
                notification.success({message: `${info.file.name} file uploaded successfully.`});
                createCourseForm.setFieldValue("image",info.file)
            } else if (status === 'error') {
                notification.error({message: `${info.file.name} file upload failed.`});
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const [accessRight, setAccessRight] = useState<number | null>(null);

    const handleAccessRightChange = (value: number) => {
        setAccessRight(value);
    };

    useEffect(() => {
        nomenclatureStore.getCategories();
    },[])

    return(
        <div className="bg-white h-full p-5 overflow-y-auto overflow-x-hidden">
            <Breadcrumb
                items={[
                    {
                        title: <Link href={"/control_panel/courses"}>Доступные курсы</Link>,
                    },
                    {
                        title: 'Новый курс',
                    },
                ]}
            />
            <h1 className="text-center text-3xl">Добавление курса</h1>
            <Form
                form={createCourseForm}
                onFinish={() => courseStore.createCourse(createCourseForm.getFieldsValue()).then((response) => {
                    router.push('/control_panel/courses')
                    notification.success({message: response.response.message})
                })}
                layout="vertical"
            >
                <Row gutter={100}>
                    <Col span={12}>
                        <Form.Item
                            name="name_course"
                            label="Название курса"
                            rules={[{required: true,message:"Название курса обязательно!"}]}
                        >
                            <Input placeholder="Введите название курса"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="description"
                            label="Краткое описание"
                        >
                            <Input placeholder="Введите краткое описание курса"/>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="image"
                    label="Картинка"
                >
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Нажмите или перенесите файл для загрузки</p>
                    </Dragger>
                </Form.Item>

               <Row gutter={100}>
                   <Col span={12}>
                       <Form.Item
                           name="category"
                           label="Категория"
                           rules={[{required: true,message:"Категория курса обязательно!"}]}
                       >
                           <Select loading={nomenclatureStore.loadingCategories}>
                               {
                                   nomenclatureStore.categories.map(category => (
                                       <Select.Option key={category.id} value={category.id}>{category.name}</Select.Option>
                                   ))
                               }
                           </Select>
                       </Form.Item>
                   </Col>

                   <Col span={12}>
                       <Form.Item
                           name="access_right"
                           label="Права доступа"
                           rules={[{required: true,message:"Права доступа курса обязательно!"}]}
                       >
                           <Select onChange={handleAccessRightChange}>
                               <Select.Option value={0}>Открытый</Select.Option>
                               <Select.Option value={1}>Закрытый</Select.Option>
                           </Select>
                       </Form.Item>
                   </Col>
                   {accessRight === 1 && (
                       <Col span={12}>
                           <Form.Item
                               name="restricted_access_detail"
                               label="Детали закрытого доступа"
                           >
                               <Input placeholder="Введите детали закрытого доступа" />
                           </Form.Item>
                       </Col>
                   )}
               </Row>

                <Form.Item
                    name="duration"
                    label="Время прохождения"
                    rules={[{required: true,message:"Время прохождения курса обязательно!"}]}
                >
                    <Input placeholder="Введите время прохождения" type="number"/>
                </Form.Item>

                <Form.Item
                    name="level"
                    label="Уровень сложности"
                    rules={[{required: true,message:"Уровень сложности курса обязательно!"}]}
                >
                    <Select>
                        {LEVEL_COURSE.map(level => (
                            <Select.Option key={level.id} value={level.id}>{level.title}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="content_description"
                    label="Содержание курса"
                >
                    <ReactQuill theme="snow"/>
                </Form.Item>

                <div className="flex flex-col items-center">
                    <Form.Item style={{marginTop: '10px'}}>
                        <Button type="primary" htmlType="submit" loading={courseStore.loadingCreateCourse}>Создать</Button>
                    </Form.Item>
                </div>
            </Form>
        </div>
    );
}

export default observer(CourseAddPage);