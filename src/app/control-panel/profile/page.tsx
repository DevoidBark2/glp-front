"use client";
import {
  Form,
  Input,
  Button,
  Select,
  Switch,
  Upload,
  Avatar,
  DatePicker,
  Radio,
  Tooltip,
  Divider,
  Modal,
  Menu,
  Dropdown,
  message,
  Spin,
  Row,
  Col,
} from "antd";
import {
  UploadOutlined,
  UserOutlined,
  LockOutlined,
  InfoCircleOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  CloudUploadOutlined,
  SettingOutlined,
  ReloadOutlined,
  HistoryOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useMobxStores } from "@/stores/stores";
import { getCookieUserDetails } from "@/lib/users";
import { UserRole } from "@/enums/UserRoleEnum";

const ProfilePage = () => {
  const [formProfile] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const { userProfileStore, avatarIconsStore } = useMobxStores();
  const [currentUser, setCurrentUser] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  const handleUploadChange = (info: any) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentUser = getCookieUserDetails();
    setCurrentUser(currentUser);

    userProfileStore.getUserProfile().then((response) => {
      formProfile.setFieldsValue(response.data);
    });

    avatarIconsStore.getAllAvatarIcons();

  }, []);

  const handleResetChanges = () => {
    formProfile.resetFields();
    setAvatar(null);
    setBackgroundImage(null);
    message.info("Изменения сброшены.");
  };

  const profileTitle = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return "Профиль администратора"
      case UserRole.MODERATOR:
        return "Профиль модератора"
      case UserRole.TEACHER:
        return "Профиль учителя"
    }
  }

  return (
    <>
      {userProfileStore.loading ? <div className="w-full mx-auto bg-white shadow-lg rounded p-8 overflow-y-auto custom-height-screen">
        {/* Profile Form */}
        <div className="flex items-center mb-8">
          <Upload
            name="avatar"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleUploadChange}
          >
            <Avatar
              size={100}
              src={avatar}
              icon={!avatar && <UserOutlined />}
              className="cursor-pointer transition-transform hover:scale-105"
            />
          </Upload>
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-gray-800">{profileTitle(currentUser?.user.role as UserRole)}</h2>
            <p className="text-gray-600">Здесь вы можете обновить ваши личные данные и настройки.</p>
          </div>
        </div>

        <Form
          form={formProfile}
          layout="vertical"
          onFinish={(values) => {
            console.log("Updated Profile:", values);
          }}
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
                rules={[{ required: true, message: "Пожалуйста, введите вашу фамилию" }]}
              >
                <Input placeholder="Введите вашу фамилию" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Отчество"
                name="last_name"
                rules={[{ required: true, message: "Пожалуйста, введите ваше отчество" }]}
              >
                <Input placeholder="Введите ваше отчество" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Телефон"
                name="phone"
                rules={[{ required: true, message: "Пожалуйста, введите ваш номер телефона" }]}
              >
                <Input placeholder="+7 (___) ___-__-__" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Дата рождения" name="birthdate">
                <DatePicker placeholder="Выберите дату" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Город" name="city">
                <Select placeholder="Выберите ваш город">
                  <Select.Option value="moscow">Москва</Select.Option>
                  <Select.Option value="saint-petersburg">Санкт-Петербург</Select.Option>
                  <Select.Option value="novosibirsk">Новосибирск</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="О себе" name="bio">
            <Input.TextArea rows={4} placeholder="Расскажите немного о себе..." />
          </Form.Item>

          <Form.Item label="Цветовая схема" name="theme">
            <Radio.Group>
              <Radio value="light">Светлая</Radio>
              <Radio value="dark">Тёмная</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Профиль в социальных сетях">
            <Input
              prefix={<FacebookOutlined />}
              placeholder="Ссылка на ваш профиль в Facebook"
              className="mb-2"
            />
            <Input
              prefix={<TwitterOutlined />}
              placeholder="Ссылка на ваш профиль в Twitter"
              className="mb-2"
            />
            <Input
              prefix={<LinkedinOutlined />}
              placeholder="Ссылка на ваш профиль в LinkedIn"
              className="mb-2"
            />
            <Input
              prefix={<InstagramOutlined />}
              placeholder="Ссылка на ваш профиль в Instagram"
            />
          </Form.Item>

          <Form.Item
            label="Уведомления"
            name="notifications"
            valuePropName="checked"
            tooltip="Включите, чтобы получать уведомления о событиях в системе."
          >
            <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Button type="primary" htmlType="submit" className="mt-4 dark:hover:bg-black">
              Сохранить изменения
            </Button>
            <Button
              type="default"
              onClick={handleResetChanges}
              className="ml-4"
            >
              Сбросить изменения
            </Button>
          </Form.Item>
        </Form>

        {/* Password Change Modal */}
        {/* <Modal
          title="Смена пароля"
          open={isPasswordModalVisible}
          onCancel={() => setIsPasswordModalVisible(false)}
          onOk={handlePasswordChange}
          okText="Изменить пароль"
          cancelText="Отмена"
        >
          <Form form={passwordForm} layout="vertical" onFinish={handlePasswordChange}>
            <Form.Item label="Новый пароль" name="new_password" rules={[{ required: true, message: "Пожалуйста, введите новый пароль" }, { min: 8, message: "Пароль должен быть минимум 8 символов" }]}>
              <Input.Password placeholder="Введите новый пароль" iconRender={(visible) => visible ? <LockOutlined /> : <LockOutlined />} />
            </Form.Item>
            <Form.Item label="Подтверждение пароля" name="confirm_password" dependencies={['new_password']} rules={[
              { required: true, message: "Пожалуйста, подтвердите новый пароль" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Пароли не совпадают"));
                },
              }),
            ]}
            >
              <Input.Password placeholder="Подтвердите новый пароль" iconRender={(visible) => visible ? <LockOutlined /> : <LockOutlined />} />
            </Form.Item>
          </Form>
        </Modal> */}
      </div> : <Spin size="large" />}
    </>
  );
};

export default ProfilePage;
