import React, { FC } from "react";
import {
    Button,
    Col,
    Form,
    FormInstance,
    Input,
    Row,
    Select,
    Spin,
    Switch,
} from "antd";
import { observer } from "mobx-react";
import TextArea from "antd/es/input/TextArea";

import { useMobxStores } from "@/shared/store/RootStore";
import { LEVEL_COURSE } from "@/shared/constants";
import { Course, StatusCourseEnum, statusLabels } from "@/shared/api/course/model";

interface CourseDetailsMainProps {
    form: FormInstance<Course>;
}

export const CourseDetailsMain: FC<CourseDetailsMainProps> = observer(({ form }) => {
    const { courseStore, nomenclatureStore } = useMobxStores();
    // const [fileList, setFileList] = useState<UploadFile[]>([{
    //     uid: uuidv4(),
    //     name: 'image.png',
    //     status: 'done',
    //     url: `${nextConfig.env?.API_URL}${courseStore.courseDetails?.image}`,
    // }]);

    // const uploadProps: UploadProps = {
    //     name: 'file',
    //     multiple: false,
    //     beforeUpload: (file) => {
    //         const isImage = file.type.startsWith('image/');
    //         if (!isImage) {
    //             message.error("Можно загружать только изображения (JPEG, PNG, GIF, WebP).");
    //             return Upload.LIST_IGNORE;
    //         }
    //         return true;
    //     },
    //     onChange: (info) => {
    //         const { file } = info;
    //         if (file.status === 'done') {
    //             const imageUrl = file.response?.url || '';
    //             form.setFieldsValue({
    //                 image: imageUrl,
    //             });
    //
    //             setFileList([
    //                 {
    //                     uid: file.uid,
    //                     name: file.name,
    //                     status: 'done',
    //                     url: `${nextConfig.env?.API_URL}${imageUrl}`,
    //                 },
    //             ]);
    //             message.success(`${file.name} успешно загружен!`);
    //         } else if (file.status === 'error') {
    //             message.error(`Ошибка загрузки ${file.name}`);
    //         }
    //     }
    // };


    const handleChangeCourse = (values:Course) => {
        courseStore.changeCourse(values).then(() => {
            courseStore.setCoursePageTitle(values.name);
        })
    }

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleChangeCourse}
        >
            {!courseStore.loadingCourseDetails ? (<>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item name="id" hidden >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label="Название курса"
                            rules={[{ required: true, message: 'Название курса обязательно!' }]}
                        >
                            <Input placeholder="Введите название курса" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="small_description"
                            label="Краткое описание"
                        >
                            <Input placeholder="Введите краткое описание курса" />
                        </Form.Item>
                    </Col>
                </Row>

                {/*<Form.Item*/}
                {/*    name="image"*/}
                {/*    label="Картинка"*/}
                {/*>*/}
                {/*    <Dragger*/}
                {/*        listType="picture"*/}
                {/*        fileList={fileList}*/}
                {/*        {...uploadProps}*/}
                {/*    >*/}
                {/*        <p className="ant-upload-drag-icon">*/}
                {/*            <InboxOutlined />*/}
                {/*        </p>*/}
                {/*        <p className="ant-upload-text">Нажмите или перенесите файл для загрузки</p>*/}
                {/*    </Dragger>*/}
                {/*</Form.Item>*/}


                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="category"
                            label="Категория"
                            rules={[{ required: nomenclatureStore.categories.length > 0, message: 'Категория курса обязательно!' }]}
                        >
                            <Select loading={nomenclatureStore.loadingCategories} placeholder="Выберите категорию">
                                {nomenclatureStore.categories.map((category) => (
                                    <Select.Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="access_right"
                            label="Права доступа"
                            rules={[{ required: true, message: 'Права доступа курса обязательно!' }]}
                        >
                            <Select onChange={(value: number) => courseStore.setAccessRight(value)}>
                                <Select.Option value={0}>Открытый</Select.Option>
                                <Select.Option value={1}>Закрытый</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                {courseStore.accessRight === 1 && (
                    <Form.Item
                        name="secret_key"
                        label="Код доступа"
                        rules={[{ required: true, message: "Код доступа обязателен!" }]}
                    >
                        <Input.OTP itemType="number" length={8} />
                    </Form.Item>
                )}

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="duration"
                            label="Время прохождения"
                            rules={[{ required: true, message: "Время прохождения курса обязательно!" }]}
                        >
                            <Input placeholder="Введите время прохождения" type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="level"
                            label="Уровень сложности"
                            rules={[{ required: true, message: "Уровень сложности курса обязательно!" }]}
                        >
                            <Select>
                                {LEVEL_COURSE.map(level => (
                                    <Select.Option key={level.id} value={level.id}>
                                        {level.title}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item name="has_certificate" label="Курс с сертификатом" valuePropName="checked">
                            <Switch checkedChildren="Да" unCheckedChildren="Нет" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="status"
                            label="Статус курса"
                            rules={[{ required: true, message: "Пожалуйста, выберите статус курса!" }]}
                        >
                            <Select>
                                {Object.entries(StatusCourseEnum).map(([key, value]) => (
                                    <Select.Option key={value} value={value}>
                                        {statusLabels[value as StatusCourseEnum]}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="content_description" label="Содержание курса">
                    <TextArea
                        rows={4}
                    />
                </Form.Item>

                <div className="flex flex-col items-center">
                    <Form.Item style={{ marginTop: '10px' }}>
                        <Button color="blue" variant="solid" htmlType="submit" loading={courseStore.loadingCreateCourse}>
                            Редактировать
                        </Button>
                    </Form.Item>
                </div>
            </>) : (<Spin />)}
        </Form>
    );
});
