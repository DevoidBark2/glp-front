"use client"
import { Breadcrumb, Button, Divider, Form, Input, notification } from "antd";
import { observer } from "mobx-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PageContainerControlPanel } from "@/shared/ui";
import { useMobxStores } from "@/shared/store/RootStore";
import { Faq } from "@/shared/api/faq/model";

const FaqEdit = observer(() => {
    const { faqId } = useParams();
    const { faqStore } = useMobxStores()
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [form] = Form.useForm();

    const changeFaq = (values: Faq) => {
        faqStore.updatedFaq(values).then((response) => {
            notification.success({ message: response.message })
            router.push('/control-panel/faq')
        }).catch
    }

    useEffect(() => {
        faqStore.getFaqById(Number(faqId)).then((response) => {
            setTitle(response.question)
            form.setFieldsValue(response)
        })
    }, [])

    return (
        <PageContainerControlPanel>
            <Breadcrumb
                items={[
                    {
                        title: <Link href={"/control-panel/faq"}>Доступные вопросы-ответы</Link>,
                    },
                    {
                        title: title ? (title.length > 50 ? `${title.slice(0, 50)}...` : title) : "Загрузка...",
                    },
                ]}
            />
            <div className="flex justify-center items-center">
                <h1 className="text-center text-3xl">Изменение вопрос-ответ</h1>
            </div>
            <Divider />
            <Form
                form={form}
                layout="vertical"
                onFinish={changeFaq}
            >
                <Form.Item name="id" hidden></Form.Item>
                <Form.Item
                    name="question"
                    label="Вопрос"
                    rules={[
                        { required: true, message: "Пожалуйста, введите вопрос" },
                        { max: 255, message: "Вопрос не может превышать 255 символов" }
                    ]}
                >
                    <Input placeholder="Введите вопрос" maxLength={255} />
                </Form.Item>
                <Form.Item
                    name="answer"
                    label="Ответ"
                    rules={[{ required: true, message: "Пожалуйста, введите ответ" }]}
                >
                    <Input.TextArea rows={4} placeholder="Введите ответ" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Изменить
                    </Button>
                </Form.Item>
            </Form>
        </PageContainerControlPanel>

    )
})

export default FaqEdit