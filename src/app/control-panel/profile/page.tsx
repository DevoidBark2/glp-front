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

const ProfilePage = () => {
  const [formProfile] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [passwordForm] = Form.useForm();
  const { userProfileStore } = useMobxStores();

  const handleUploadChange = (info:any) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      setLoading(false);
    }
  };

  const handlePasswordChange = () => {
    passwordForm
      .validateFields()
      .then((values) => {
        console.log("Updated Password:", values);
        setIsPasswordModalVisible(false);
        passwordForm.resetFields();
      })
      .catch((errorInfo) => {
        console.error("Failed:", errorInfo);
      });
  };

  const handleResetChanges = () => {
    formProfile.resetFields();
    setAvatar(null);
    setBackgroundImage(null);
    message.info("Изменения сброшены.");
  };

  const handleViewActivityHistory = () => {
    // Здесь может быть вызов для просмотра истории активности
    message.info("Просмотр истории активности.");
  };

  useEffect(() => {
    userProfileStore.getUserProfile().then(() => {
        formProfile.setFieldsValue(userProfileStore.userProfileDetails);
    });
  }, []);

  // Dropdown меню для функциональных кнопок
  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<DownloadOutlined />} onClick={() => {}}>
        Загрузить данные профиля
      </Menu.Item>
      <Menu.Item key="2" icon={<ReloadOutlined />} onClick={handleResetChanges}>
        Сбросить изменения
      </Menu.Item>
      <Menu.Item key="3" icon={<HistoryOutlined />} onClick={handleViewActivityHistory}>
        Просмотр истории активности
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="w-full mx-auto bg-white shadow-lg rounded p-8 overflow-y-auto custom-height-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        {/* <div className="flex items-center">
          <Avatar
            size={50}
            src={avatar}
            icon={!avatar && <UserOutlined />}
            className="cursor-pointer transition-transform hover:scale-105"
          />
          <div className="ml-4">
            <h1 className="text-3xl font-bold text-gray-800">Настройки профиля</h1>
          </div>
        </div> */}
        <Dropdown overlay={menu} trigger={['click']}>
          <Button icon={<SettingOutlined />} type="default">
            Опции
          </Button>
        </Dropdown>
      </div>

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
          <h2 className="text-2xl font-bold text-gray-800">Профиль пользователя</h2>
          <p className="text-gray-600">Здесь вы можете обновить ваши личные данные и настройки.</p>
        </div>
      </div>

      {/* Background Image Upload */}
      <Form.Item label="Фоновое изображение">
        <Upload
          name="backgroundImage"
          showUploadList={false}
          beforeUpload={() => false}
          onChange={(info) => {
            if (info.file.status === "done") {
              //setBackgroundImage(URL.createObjectURL(info.file.originFileObj));
            }
          }}
        >
          <Button icon={<CloudUploadOutlined />}>Загрузить фон</Button>
        </Upload>
      </Form.Item>

      <Form
        form={formProfile}
        layout="vertical"
        onFinish={(values) => {
          console.log("Updated Profile:", values);
        }}
      >
        {/* Basic Info Fields */}
        <Form.Item label="Имя" name="first_name" rules={[{ required: true, message: "Пожалуйста, введите ваше имя" }]}>
          <Input placeholder="Введите ваше имя" />
        </Form.Item>

        <Form.Item label="Фамилия" name="second_name" rules={[{ required: true, message: "Пожалуйста, введите вашу фамилию" }]}>
          <Input placeholder="Введите вашу фамилию" />
        </Form.Item>

        <Form.Item label="Отчество" name="last_name" rules={[{ required: true, message: "Пожалуйста, введите ваше отчество" }]}>
          <Input placeholder="Введите ваше отчество" />
        </Form.Item>

        {/* Bio Field */}
        <Form.Item label="О себе" name="bio">
          <Input.TextArea rows={4} placeholder="Расскажите немного о себе..." />
        </Form.Item>

        {/* City Selection */}
        <Form.Item label="Город" name="city">
          <Select placeholder="Выберите ваш город">
            <Select.Option value="moscow">Москва</Select.Option>
            <Select.Option value="saint-petersburg">Санкт-Петербург</Select.Option>
            <Select.Option value="novosibirsk">Новосибирск</Select.Option>
          </Select>
        </Form.Item>

        {/* Theme Selection */}
        <Form.Item label="Цветовая схема" name="theme">
          <Radio.Group>
            <Radio value="light">Светлая</Radio>
            <Radio value="dark">Тёмная</Radio>
          </Radio.Group>
        </Form.Item>

        {/* Social Media Links */}
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

        {/* Notifications Switch */}
        <Form.Item label="Уведомления" name="notifications" valuePropName="checked" tooltip="Включите, чтобы получать уведомления о событиях в системе.">
          <Switch checkedChildren="Вкл" unCheckedChildren="Выкл" />
        </Form.Item>

        {/* Password Change Modal Trigger */}
        <Form.Item>
          <Button type="default" onClick={() => setIsPasswordModalVisible(true)}>
            Изменить пароль
          </Button>
        </Form.Item>

        <Divider />

        {/* Save Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="mt-4 dark:hover:bg-black">
            Сохранить изменения
          </Button>
        </Form.Item>
      </Form>

      {/* Password Change Modal */}
      <Modal
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
      </Modal>
    </div>
  );
};

export default ProfilePage;
