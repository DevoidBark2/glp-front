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
  DatePicker,
  Checkbox,
} from "antd";
import {
  CameraOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";

import "react-phone-input-2/lib/bootstrap.css";
import { observer } from "mobx-react";
import dayjs from "dayjs";

import nextConfig from "next.config.mjs";
import { UserRole } from "@/shared/api/user/model";
import { PageContainerControlPanel } from "@/shared/ui";
import { AuthMethodEnum } from "@/shared/api/auth/model";
import {useMobxStores} from "@/shared/store/RootStore";

const ProfilePage = () => {
  const { userProfileStore } = useMobxStores();
  const [formProfile] = Form.useForm();
  const [formSettings] = Form.useForm();
  const [avatar, setAvatar] = useState<string | null>(null);
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
    userProfileStore.getUserProfile().then((response) => {
      setAvatar(response.image ? `${nextConfig.env?.API_URL}${response.image}` : null);

      if (response.birth_day) {
        response.birth_day = dayjs(response.birth_day)
      }
      formProfile.setFieldsValue(response);
      formSettings.setFieldsValue(response);
      if (response.show_footer_table) {
        setShowFooterOptions(true)
      }

    }).finally(() => {
      userProfileStore.setLoading(false)
    });
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
              <Spin spinning={userProfileStore.loading}>
                <Avatar
                  size={100}
                  src={
                    userProfileStore.userProfile?.image
                      ? userProfileStore.userProfile.method_auth === AuthMethodEnum.GOOGLE ||
                        userProfileStore.userProfile.method_auth === AuthMethodEnum.YANDEX
                        ? userProfileStore.userProfile?.image
                        : `${nextConfig.env?.API_URL}${userProfileStore.userProfile?.image}`
                      : undefined
                  }
                  icon={!userProfileStore.userAvatar && <UserOutlined />}
                  className="cursor-pointer"
                  style={{
                    opacity: userProfileStore.uploadingProfileImage ? 0.5 : 1,
                    transition: 'opacity 0.3s ease',
                  }}
                />
              </Spin>

              <div
                className="absolute bottom-5 right-5 bg-white rounded-full shadow-lg p-2 flex items-center justify-center"
                style={{
                  transform: 'translate(50%, 50%)',
                }}
              >
                <CameraOutlined style={{ fontSize: 18, color: '#595959' }} />
              </div>
            </div>
          </Upload>
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {profileTitle(userProfileStore.userProfile?.role!)}
            </h2>
            <p className="text-gray-600">
              Здесь вы можете обновить ваши личные данные и настройки.
            </p>
          </div>
        </div>

        <Form
          form={formProfile}
          layout="vertical"
          onFinish={(values) => userProfileStore.updateProfile(values).then(response => {
            notification.success({message: response.message})
          })}
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
            <Form.Item hidden name="settings_control_panel" initialValue={true}></Form.Item>
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
