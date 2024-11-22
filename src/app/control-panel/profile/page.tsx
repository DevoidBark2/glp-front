"use client";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Avatar,
  Divider,
  message,
  Spin,
  Row,
  Col,
  InputNumber,
  Tabs,
  notification,
  TabsProps,
  Tooltip,
  DatePicker,
  Checkbox,
} from "antd";
import {
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useMobxStores } from "@/stores/stores";
import { getCookieUserDetails } from "@/lib/users";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import nextConfig from "next.config.mjs";
import { observer } from "mobx-react";
import dayjs from "dayjs";
import { UserRole } from "@/shared/api/user/model";
import PageContainerControlPanel from "@/components/PageContainerControlPanel/PageContainerControlPanel";

const ProfilePage = () => {
  const [formProfile] = Form.useForm();
  const [formSettings] = Form.useForm();
  const [avatar, setAvatar] = useState<string | null>(null);
  const { userProfileStore, avatarIconsStore } = useMobxStores();
  const [currentUser, setCurrentUser] = useState(null);

  const [showFooterOptions, setShowFooterOptions] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleAvatarUpload = async (file: File) => {
    setLoading(true);
    try {
      const response = await userProfileStore.uploadAvatar(file);
      setAvatar(`${nextConfig.env?.API_URL}${response.data}`);
      notification.success({ message: response.message });
    } catch (error) {
      message.error('Ошибка загрузки аватара');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentUser = getCookieUserDetails();
    setCurrentUser(currentUser);

    userProfileStore.getUserProfile().then((response) => {
      const userData = response.data;
      setAvatar(`${nextConfig.env?.API_URL}${userData.image}`);

      if (userData.birth_day) {
        userData.birth_day = dayjs(userData.birth_day)
      }
      formProfile.setFieldsValue(userData);
      formSettings.setFieldsValue(userData);
      if (userData.show_footer_table) {
        setShowFooterOptions(true)
      }

    }).finally(() => {
      userProfileStore.setLoading(false)
    });

    avatarIconsStore.getAllAvatarIcons();
  }, []);

  const profileTitle = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return "Профиль администратора";
      case UserRole.MODERATOR:
        return "Профиль модератора";
      case UserRole.TEACHER:
        return "Профиль учителя";
    }
  };

  const items: TabsProps['items'] = [
    {
      key: "1",
      label: "Личные данные",
      children: <>
        <div className="flex items-center mb-8">
          <Upload
            name="avatar"
            showUploadList={false}
            beforeUpload={(file) => {
              handleAvatarUpload(file);
              return false;
            }}
          >
            <div className="relative cursor-pointer transition-transform hover:scale-105">
              {loading ? (
                <Spin
                  size="large"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1,
                  }}
                />
              ) : null}
              <Avatar
                size={100}
                src={avatar || undefined}
                icon={!avatar && <UserOutlined />}
                className="cursor-pointer"
                style={{
                  opacity: loading ? 0.5 : 1,
                  transition: 'opacity 0.3s ease',
                }}
              />
            </div>
          </Upload>
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {profileTitle(currentUser?.user?.role as UserRole)}
            </h2>
            <p className="text-gray-600">
              Здесь вы можете обновить ваши личные данные и настройки.
            </p>
          </div>
        </div>

        <Form
          form={formProfile}
          layout="vertical"
          onFinish={(values) => userProfileStore.updateProfile(values)}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Имя"
                name="first_name"
                rules={[{ required: true, message: "Пожалуйста, введите ваше имя" }]}
              >
                <Input placeholder="Введите ваше имя" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Фамилия"
                name="second_name"
              >
                <Input placeholder="Введите вашу фамилию" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Отчество"
                name="last_name"
              >
                <Input placeholder="Введите ваше отчество" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Телефон"
                name="phone"
              >
                <PhoneInput
                  inputStyle={{ width: '100%', height: '20px' }}
                  country={"ru"}
                  enableSearch={true}
                  searchPlaceholder={"Пожалуйста, введите телефонный номер!"}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Пожалуйста, введите ваш email" },
                  { type: 'email', message: "Введите корректный Email!" }
                ]}
              >
                <Input placeholder="Введите ваш Email" />
              </Form.Item>
            </Col>


            <Col xs={24} md={12}>
              <Form.Item label="Дата рождения" name="birth_day">
                <DatePicker
                  showNow={false}
                  placeholder="Выберите дату"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Город" name="city">
                <Input placeholder="Введите город..." />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="О себе" name="about_me">
            <Input.TextArea rows={4} placeholder="Расскажите немного о себе..." />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={userProfileStore.saveProfile} className="mt-4 dark:hover:bg-black">
              Сохранить изменения
            </Button>
          </Form.Item>
        </Form>
      </>
    },
    {
      key: "2",
      label: "Настройки панели управления",
      children: <> <Form
        form={formSettings}
        layout="vertical"
        onFinish={(values) => userProfileStore.updateProfile(values)}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              tooltip="Определяет количество элементов, отображаемых на одной странице списка."
              label="Количество элементов на странице"
              name="pagination_size"
              rules={[{ required: true, message: "Укажите количество элементов" }]}
            >
              <InputNumber max={200} />
            </Form.Item>
            <Form.Item
              tooltip="Размер таблицы"
              label="Размер таблиц"
              name="table_size"
              rules={[{ required: true, message: "Укажите количество элементов" }]}
            >
              <Select>
                <Select.Option value="large">Большой</Select.Option>
                <Select.Option value="middle">Средний</Select.Option>
                <Select.Option value="small">Маленький</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              tooltip="Отображение нижней части таблицы"
              label="Отображение нижней части таблицы"
              name="show_footer_table"
              valuePropName="checked"
            >
              <Checkbox onChange={(e) => setShowFooterOptions(e.target.checked)}>
                Показать нижнюю часть таблицы
              </Checkbox>
            </Form.Item>

            {showFooterOptions && (
              <Form.Item
                label="Выберите содержимое для нижней части"
                name="footerContent"
                rules={[{ required: true, message: "Выберите опцию для нижней части" }]}
              >
                <Select placeholder="Выберите отображение в footer">
                  <Select.Option value="totalCount">Общее количество записей</Select.Option>
                </Select>
              </Form.Item>
            )}

          </Col>
        </Row>

        <Divider />

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={userProfileStore.saveProfile} className="mt-4">
            Сохранить изменения
          </Button>
        </Form.Item>
      </Form></>
    }
  ]

  return (
    <PageContainerControlPanel>
      {userProfileStore.loading ? <div className="flex justify-center items-center"><Spin size="large" /></div> : <Tabs defaultActiveKey="1" items={items} />}
    </PageContainerControlPanel>
  );
};

export default observer(ProfilePage);
