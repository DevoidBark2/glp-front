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
  Checkbox,
  InputNumber,
  Tabs,
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

const { TabPane } = Tabs;

const ProfilePage = () => {
  const [formProfile] = Form.useForm();
  const [formSettings] = Form.useForm();
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

  const handleSettingsReset = () => {
    formSettings.resetFields();
    message.info("Настройки сброшены.");
  };

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

  return (
    <>
      {userProfileStore.loading ? (
        <div className="w-full mx-auto bg-white shadow-lg rounded p-8 overflow-y-auto custom-height-screen">
          {/* Tabs для разделения профиля и настроек */}
          <Tabs defaultActiveKey="1">
            <TabPane tab="Личные данные" key="1">
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
                  <h2 className="text-2xl font-bold text-gray-800">
                    {profileTitle(currentUser?.user.role as UserRole)}
                  </h2>
                  <p className="text-gray-600">
                    Здесь вы можете обновить ваши личные данные и настройки.
                  </p>
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
            </TabPane>

            {/* Вторая вкладка с настройками */}
            <TabPane tab="Настройки панели управления" key="2">
              <Form
                form={formSettings}
                layout="vertical"
                onFinish={(values) => {
                  console.log("Settings Updated:", values);
                }}
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Количество элементов на странице"
                      name="pagination_size"
                      initialValue={10}
                      rules={[{ required: true, message: "Укажите количество элементов" }]}
                    >
                      <InputNumber min={5} max={100} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Автоматическое обновление данных"
                      name="auto_refresh"
                      valuePropName="checked"
                      initialValue={true}
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Отображать иконки уведомлений"
                      name="show_notifications"
                      valuePropName="checked"
                      initialValue={true}
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Показывать историю изменений"
                      name="show_history"
                      valuePropName="checked"
                      initialValue={false}
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />

                <Form.Item>
                  <Button type="primary" htmlType="submit" className="mt-4">
                    Сохранить настройки
                  </Button>
                  <Button
                    type="default"
                    onClick={handleSettingsReset}
                    className="ml-4"
                  >
                    Сбросить настройки
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </div>
      ) : (
        <Spin size="large" />
      )}
    </>
  );
};

export default ProfilePage;
