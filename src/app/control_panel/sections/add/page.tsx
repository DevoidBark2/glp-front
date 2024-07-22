"use client"
import {Breadcrumb, Button, Col, Flex, Form, notification, Row, Select, UploadProps} from "antd";
import {useMobxStores} from "@/stores/stores";
import {Input} from "antd/lib";
import {InboxOutlined} from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";
import React from "react";
import {useRouter} from "next/navigation";
import {observer} from "mobx-react";
import Link from "next/link";

const SectionAddPage = () => {

    const {courseStore} = useMobxStores();
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

    return(
        <div className="bg-white h-full p-5 overflow-y-auto overflow-x-hidden">
            <Breadcrumb items={[ {
                title: <Link href="/control_panel/sections">Разделы</Link>,
            },]}/>
            <h1 className="text-center text-3xl">Добавление раздела</h1>
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
                            label="Назвавние курса"
                            rules={[{required: true,message:"Название курса обязательно!"}]}
                        >
                            <Input placholder="Введите название курса"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="description"
                            label="Описание"
                        >
                            <Input placeholder="Введите описание курса"/>
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
                       >
                           <Select>
                               <Select.Option value={1}>Программирование</Select.Option>
                               <Select.Option value={2}>Высшая математика</Select.Option>
                               <Select.Option value={3}>Дискретная математика</Select.Option>
                               <Select.Option value={4}>Математический анализ</Select.Option>
                           </Select>
                       </Form.Item>
                   </Col>

                   <Col span={12}>
                       <Form.Item
                           name="access_right"
                           label="Права доступа"
                       >
                           <Select>
                               <Select.Option value={0}>Открытый</Select.Option>
                               <Select.Option value={1}>Закрытый</Select.Option>
                           </Select>
                       </Form.Item>
                   </Col>
               </Row>

                <Form.Item
                    name="duration"
                    label="Время прохождения"
                >
                    <Input placeholer="Введите время прохождения" type="number"/>
                </Form.Item>

                <Form.Item
                    name="level"
                    label="Уровень сложности"
                >
                    <Select>
                        <Select.Option value={1}>Начинающий</Select.Option>
                        <Select.Option value={2}>Средний</Select.Option>
                        <Select.Option value={3}>Высокий</Select.Option>
                    </Select>
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

export default observer(SectionAddPage);