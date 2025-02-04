import { StatusCourseEnum, statusLabels } from "@/shared/api/course/model";
import { LEVEL_COURSE } from "@/shared/constants";
import { useMobxStores } from "@/shared/store/RootStore";
import { Button, Col, Form, FormInstance, Input, Row, Select, Spin, Switch } from "antd";
import { observer } from "mobx-react";
import dynamic from "next/dynamic";
import { FC, useState } from "react";
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface CourseDetailsMainProps {
    form: FormInstance
}

export const CourseDetailsMain: FC<CourseDetailsMainProps> = observer(({ form }) => {
    const { courseStore, nomenclatureStore } = useMobxStores()
    const [accessRight, setAccessRight] = useState(0);

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={(values) => courseStore.changeCourse(values).then(() => {
                courseStore.setCoursePageTitle(values.name);
            })}
        >
            {!courseStore.loadingCourseDetails ? (<>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item name="id" hidden />
                        <Form.Item
                            name="name"
                            label="Название курса"
                            rules={[{ required: true, message: 'Название курса обязательно!' }]}
                        >
                            <Input placeholder="Введите название курса" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="small_description"
                            label="Краткое описание"
                        >
                            <Input placeholder="Введите краткое описание курса"
                                style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="category"
                            label="Категория"
                            rules={[{
                                required: nomenclatureStore.categories.length > 0,
                                message: 'Категория курса обязательно!',
                            },]}
                        >
                            <Select
                                loading={nomenclatureStore.loadingCategories}
                                placeholder="Выберите категорию"
                                style={{ width: '100%' }}
                            >
                                {!nomenclatureStore.loadingCategories && nomenclatureStore.categories.length > 0 ? nomenclatureStore.categories.map((category) => (
                                    <Select.Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Select.Option>)) : <Spin />}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="access_right"
                            label="Права доступа"
                            rules={[{
                                required: true, message: 'Права доступа курса обязательно!',
                            },]}
                        >
                            <Select style={{ width: '100%' }} onChange={(value: number) => courseStore.setAccessRight(value)}>
                                <Select.Option value={0}>Открытый</Select.Option>
                                <Select.Option value={1}>Закрытый</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                {courseStore.accessRight === 1 && (
                    <Form.Item
                        layout="vertical"
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
                            rules={[{
                                required: true, message: "Время прохождения курса обязательно!"
                            }]}
                        >
                            <Input placeholder="Введите время прохождения" type="number" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="level"
                            label="Уровень сложности"
                            rules={[{
                                required: true, message: "Уровень сложности курса обязательно!"
                            }]}
                        >
                            <Select>
                                {LEVEL_COURSE.map(level => (<Select.Option key={level.id}
                                    value={level.id}>{level.title}</Select.Option>))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="has_certificate"
                            label="Курс с сертификатом"
                            valuePropName="checked"
                        >
                            <Switch
                                checkedChildren="Да"
                                unCheckedChildren="Нет"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="status"
                            label="Статус курса"
                            rules={[{
                                required: true, message: "Пожалуйста, выберите статус курса!"
                            }]}
                        >
                            <Select>
                                {Object.entries(StatusCourseEnum).map(([key, value]) => (
                                    <Select.Option key={value} value={value}>
                                        {statusLabels[value as StatusCourseEnum]}
                                    </Select.Option>))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="content_description" label="Содержание курса">
                    {typeof window !== 'undefined' && <ReactQuill theme="snow" />}
                </Form.Item>

                <div className="flex flex-col items-center">
                    <Form.Item style={{ marginTop: '10px' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={courseStore.loadingCreateCourse}
                        >
                            Редактировать
                        </Button>
                    </Form.Item>
                </div>
            </>) : (<Spin />)}
        </Form>
    )
})