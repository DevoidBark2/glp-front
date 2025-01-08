"use client"
import { Faq } from "@/shared/api/faq/model";
import { useMobxStores } from "@/shared/store/RootStore";
import { PageContainerControlPanel } from "@/shared/ui";
import { Breadcrumb, Button, Divider, Form, Input, notification } from "antd";
import { observer } from "mobx-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const FaqAdd = observer(() => {
    const { faqStore } = useMobxStores()
    const router = useRouter()
    const [form] = Form.useForm();

    const addNewFaq = (values: Faq) => {
        faqStore.create(values).then((response) => {
            notification.success({ message: response.message })
            router.push('/control-panel/faq')
        }).catch
    }

    return (
        <PageContainerControlPanel>
            <Breadcrumb
                items={[
                    {
                        title: <Link href={"/control-panel/faq"}>Доступные вопросы-ответы</Link>,
                    },
                    {
                        title: 'Новый вопрос-ответ',
                    },
                ]}
            />
            <div className="flex justify-center items-center">
                <h1 className="text-center text-3xl">Добавление вопрос-ответ</h1>
            </div>
            <Divider />
            <Form
                form={form}
                layout="vertical"
                onFinish={addNewFaq}
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
                        Добавить
                    </Button>
                </Form.Item>
            </Form>
        </PageContainerControlPanel>

    )
})

export default FaqAdd