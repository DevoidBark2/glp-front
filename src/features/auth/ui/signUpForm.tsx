import { Button, Form, Input, notification } from "antd";
import {EyeInvisibleOutlined, EyeTwoTone} from "@ant-design/icons";
import { useMobxStores } from "@/stores/stores";

type SignUpFormType = {
    first_name: string;
    second_name: string;
    last_name: string;
    email: string;
    password: string;
}

export const SignUpForm = () => {
    const [recaptha,setRecaptha] = useState<string | null>(null);
    const { userStore } = useMobxStores();
    const [form] = Form.useForm<SignUpFormType>();

    const handleSubmitForm = (values: SignUpFormType) => {
        userStore.registerUser(values).then(response => {
            userStore.setOpenRegisterModal(false);
            notification.success({message: response.response.data.message})
        }).catch(e => {
            notification.error({
                message: e.response.data.message
            })
        })
    }

    return(
        <div className="flex m-auto">
            <Form
                    form={form}
                    layout="vertical"
                    style={{width:300}}
                    onFinish={handleSubmitForm}
                >
                    <Form.Item
                        label="Имя"
                        name="first_name"
                        rules={[{required: true,message:"Поле обязательно!"}]}
                    >
                        <Input
                            placeholder="Введите ваше имя"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Фамилия"
                        name="second_name"
                        rules={[{required: true,message:"Поле обязательно!"}]}
                    >
                        <Input
                            placeholder="Введите вашу фамилию"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Отчество"
                        name="last_name"
                        rules={[{required: true,message:"Поле обязательно!"}]}
                    >
                        <Input
                            placeholder="Введите ваше отчество"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {required: true,message:"Поле обязательно!"},
                            {
                                type: "email",
                                message: "Формат email должен быть верным!"
                            }
                        ]}
                    >
                        <Input
                            placeholder="Введите Email"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={[{ required: true, message: "Поле обязательно!" }]}
                    >
                        <Input.Password
                            placeholder="Введите пароль"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Повторите пароль"
                        name="password_repeat"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: "Поле обязательно!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Пароли не совпадают!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder="Введите пароль"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>


                    <div className="flex flex-col items-center">
                        <Form.Item style={{marginTop: '22px'}}>
                            <Button type="primary" htmlType="submit" loading={userStore.loading}
                                    style={{padding: '20px 43px', display: "flex", alignItems: "center"}}>
                                Зарегистрироваться
                            </Button>
                        </Form.Item>
                        <p>Есть аккаунт? <span onClick={() => {
                            userStore.setOpenRegisterModal(false)
                        }} className="hover:cursor-pointer text-[#00b96b]">Авторизуйся</span></p>
                    </div>
                </Form>
        </div>
    );
}