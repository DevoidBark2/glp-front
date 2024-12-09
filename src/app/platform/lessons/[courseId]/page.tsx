"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import {
    Menu,
    Layout,
    Card,
    Progress,
    Button,
    Dropdown,
    Tooltip,
    Modal,
    Form,
    Checkbox,
    Select,
    InputNumber,
    Spin,
    Skeleton,
    List,
    Typography, Divider,
    notification
} from "antd";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
    LogoutOutlined,
    ToolOutlined,
    EllipsisOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    QuestionCircleOutlined,
    FileImageOutlined, FilePdfOutlined, FileWordOutlined, FileTextOutlined, FileExcelOutlined, FileOutlined
} from "@ant-design/icons";
import { useMobxStores } from "@/stores/stores";
import { Header } from "antd/es/layout/layout";
import { CourseComponentType } from "@/shared/api/course/model";
import { QuizComponent } from "@/entities/course/ui/QuizComponent";
import { QuizMultiComponent } from "@/entities/course/ui/QuizMultiComponent";
import { TextComponent } from "@/entities/course/ui/TextComponent";
import { MenuItem } from "@/utils/dashboardMenu";
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { CourseMenu } from "@/stores/CourseStore";
import Link from "next/link";
import Image from "next/image";
import nextConfig from "next.config.mjs";

const { Sider, Content } = Layout;

const LessonPage = () => {
    const { courseId } = useParams();
    const { courseStore } = useMobxStores();
    const [selectedSection, setSelectedSection] = useState(0);
    const [collapsed, setCollapsed] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    // Отправка данных из формы
    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                console.log('Настройки сохранены:', values);
                setIsModalVisible(false);
            })
            .catch((info) => {
                console.log('Ошибка при сохранении настроек:', info);
            });
    };

    const handleMenuClick = ({ key }: any) => {
        setSelectedSection(key);
        // courseStore.updateSectionStep(Number(selectedSection));
        router.push(`/platform/courses/${courseId}?step=${key}`);
    };

    const renderIconCountAnswerUser = (menuItem: CourseMenu) => {
        let icon = null;
        let tooltipTitle = "";

        if (!menuItem.userAnswer) {
            return (
                <Tooltip title={!collapsed ? "Этап не пройден" : "" } overlayInnerStyle={{ whiteSpace: "pre-wrap" }}>
                    <QuestionCircleOutlined style={{ color: "gray", marginRight: "8px", fontSize: 25 }} />
                </Tooltip>
            );
        }

        const { confirmedStep, totalAnswers, correctAnswers } = menuItem.userAnswer;

        if (confirmedStep) {
            return (
                <Tooltip title={!collapsed ? "Этап подтвержден" : ""} overlayInnerStyle={{ whiteSpace: "pre-wrap" }}>
                    <CheckCircleOutlined style={{ color: "green", marginRight: "8px", fontSize: 25 }} />
                </Tooltip>
            );
        }

        if (correctAnswers === totalAnswers) {
            icon = <CheckCircleOutlined style={{ color: "green", marginRight: "8px", fontSize: 25 }} />;
            tooltipTitle = `Все задания выполнены верно (${correctAnswers}/${totalAnswers})`;
        } else if (correctAnswers === 0) {
            icon = <CloseCircleOutlined style={{ color: "red", marginRight: "8px", fontSize: 25 }} />;
            tooltipTitle = `Все задания выполнены неверно (0/${totalAnswers})`;
        } else {
            icon = <ExclamationCircleOutlined style={{ color: "orange", marginRight: "8px", fontSize: 25 }} />;
            tooltipTitle = `Часть заданий выполнена верно (${correctAnswers}/${totalAnswers})`;
        }

        return (
            <Tooltip title={!collapsed ? tooltipTitle : ""} overlayInnerStyle={{ whiteSpace: "pre-wrap" }}>
                {icon}
            </Tooltip>
        );
    };


    const items: MenuItem[] = courseStore.courseMenuItems?.sections?.map((section) => {
        if (section.children && section.children.length > 0) {
            return {
                key: section.id.toString(),
                label: (
                    <Tooltip title={section.name} placement={collapsed ? "right" : "top"}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: collapsed ? 'center' : 'flex-start', // Центрируем текст, если collapsed
                                overflow: 'hidden', // Прячем текст, если не влезает
                            }}
                        >
                            <span
                                style={{
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    whiteSpace: 'nowrap', // Предотвращаем перенос
                                    textOverflow: 'ellipsis', // Сокращаем текст, если не помещается
                                    overflow: 'hidden', // Скрываем лишний текст
                                }}
                            >
                                {section.name}
                            </span>
                        </div>
                    </Tooltip>

                ),

                icon: <ExclamationCircleOutlined style={{ color: '#d32f2f' }} />,
                type: 'group', // Главный раздел как группа
                children: section.children.map((child, index) => ({
                    key: child.id.toString(),
                    label: (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: "space-between",
                                padding: '8px 16px',
                                borderLeft: '2px solid #4caf50',
                            }}
                        >
                            <p
                            >
                                {child.name}
                            </p>

                        </div>
                    ),
                    icon: renderIconCountAnswerUser(child)
                }))

            };
        }
        return {
            key: section.id.toString(),

            label: (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 16px',
                        borderLeft: '2px solid #4caf50', // Зеленая граница
                    }}
                >
                    <span
                        style={{
                            fontWeight: 'bold',
                            color: '#d32f2f', // Красный цвет текста
                        }}
                    >
                        {section.name}
                    </span>
                </div>
            ),
            icon: <ExclamationCircleOutlined style={{ color: '#d32f2f' }} />,
        };
    }) || [];

    const menuItems = [
        {
            key: 'settings',
            icon: <ToolOutlined />,
            label: 'Настройки',
            onClick: () => setIsModalVisible(true),
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Выход',
        },
    ];


    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop().toLowerCase();

        switch (extension) {
            case 'pdf':
                return <Image src="/static/pdf-icon.svg" alt={extension} width={30} height={30} />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'svg':
            case 'webp':
                return <FileImageOutlined className="text-blue-500" />;
            case 'doc':
            case 'docx':
                return <FileWordOutlined className="text-green-500" />;
            case 'xlsx':
            case 'xls':
                return <Image src="/static/excel-icon.svg" alt={extension} width={30} height={30} />;
            case 'txt':
                return <FileTextOutlined className="text-gray-600" />;
            case 'zip':
            case 'rar':
            case '7z':
            case 'tar':
            case 'gz':
                return <Image src="/static/zip-icon.svg" alt={extension} width={30} height={30} />;
            case 'mp3':
            case 'wav':
            case 'ogg':
            case 'flac':
                return <Image src="/static/audio-icon.svg" alt={extension} width={30} height={30} />;
            case 'mp4':
            case 'mov':
            case 'avi':
            case 'mkv':
                return <Image src="/static/video-icon.svg" alt={extension} width={30} height={30} />;
            case 'exe':
            case 'msi':
                return <Image src="/static/exe-icon.svg" alt={extension} width={30} height={30} />;
            case 'html':
            case 'css':
            case 'js':
            case 'ts':
            case 'json':
            case 'xml':
                return <Image src="/static/exe-icon.svg" alt={extension} width={30} height={30} />;
            case 'csv':
                return <Image src="/static/csv-icon.svg" alt={extension} width={30} height={30} />;
            default:
                return <FileOutlined className="text-gray-400" />;
        }
    };


    useEffect(() => {
        courseStore.getFullCourseById(Number(courseId)).then((response) => {
            const stepFromUrl = Number(searchParams.get("step"));
            const initialSectionId: number = stepFromUrl || response?.sections[0].children[0]?.id;
            setSelectedSection(initialSectionId);

            courseStore.getSectionById(Number(courseId), initialSectionId)

            if (!stepFromUrl) {
                router.push(`/platform/courses/${courseId}?step=${initialSectionId}`);
            }
        }).catch(e => {
            router.push('/platform/courses');
            notification.error({message: e.response.data.message})
        });

    }, [courseId]);

    useEffect(() => {
        if (Number(selectedSection) !== 0) {
            courseStore.getSectionById(Number(courseId), Number(selectedSection))
        }

    }, [searchParams])


    return (
        <Layout>
            <Modal
                title="Настройки курса"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                okText="Сохранить"
                cancelText="Отмена"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="showProgress"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Checkbox>Показывать прогресс прохождения</Checkbox>
                    </Form.Item>

                    <Form.Item
                        name="enableNotifications"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Checkbox>Включить уведомления</Checkbox>
                    </Form.Item>

                    <Form.Item
                        name="timerDuration"
                        label="Таймер на вопрос (в секундах)"
                        rules={[{ type: 'number', min: 10, max: 300, message: 'Введите значение от 10 до 300' }]}
                    >
                        <InputNumber min={10} max={300} placeholder="Введите время" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="questionDifficulty"
                        label="Сложность вопросов"
                    >
                        <Select placeholder="Выберите сложность">
                            <Select.Option value="easy">Легкий</Select.Option>
                            <Select.Option value="medium">Средний</Select.Option>
                            <Select.Option value="hard">Сложный</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="trainingMode"
                        valuePropName="checked"
                        initialValue={false}
                    >
                        <Checkbox>Режим тренировки (показ ответов после вопроса)</Checkbox>
                    </Form.Item>

                    <Form.Item
                        name="retryErrorsOnly"
                        valuePropName="checked"
                        initialValue={false}
                    >
                        <Checkbox>Повторно проходить только ошибки</Checkbox>
                    </Form.Item>
                </Form>
            </Modal>

            <Header className="flex items-center fixed w-full top-0 left-0 z-50 bg-[#001529] h-16">
                {courseStore.courseMenuLoading ? (
                    <Spin />
                ) : (
                    <h1 className="text-xl font-bold text-white">
                        {courseStore.courseMenuItems?.courseName}
                    </h1>
                )}
                <div className="flex-1 mx-4">
                    {
                        !courseStore.courseMenuLoading &&
                            <Progress
                                percent={20}
                                strokeColor="green"
                                trailColor="#CCCCCC"
                                showInfo={true}
                                format={(percent) => <span className="text-white font-bold">{percent}%</span>}
                            />
                    }
                </div>
            </Header>

            <Layout className="mt-16">
                <Sider
                    collapsed={collapsed}
                    width={300}
                    className="fixed top-16"
                    style={{position: 'fixed'}}
                >
                    <div className="flex justify-end px-3 rounded-full">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined size={30} style={{ color: 'white' }} /> : <MenuFoldOutlined size={30} style={{ color: 'white' }} />}
                            onClick={() => setCollapsed(!collapsed)}
                        />
                    </div>
                    {
                        courseStore.courseMenuItems ? (
                            <Menu
                                theme="dark"
                                mode="inline"
                                selectedKeys={[selectedSection.toString()]}
                                items={items}
                                style={{paddingBottom: 20}}
                                className="h-[calc(100vh-96px)] overflow-y-auto custom-scrollbar"
                                onClick={handleMenuClick}
                            />
                        ) : (
                            <>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(it => (
                                    <Skeleton.Input key={it} active block style={{ width: 250, marginLeft: 10, marginTop: 10 }} />
                                ))}
                            </>
                        )
                    }
                    {/*<div className={`absolute bottom-3 left-0 w-full p-4 border-t border-gray-300 bg-white flex gap-2 ${collapsed ? 'justify-center' : 'justify-between'}`}>*/}
                    {/*    {!collapsed ? (*/}
                    {/*        <>*/}
                    {/*            <Tooltip title="Настройки">*/}
                    {/*                <Button*/}
                    {/*                    type="text"*/}
                    {/*                    icon={<ToolOutlined />}*/}
                    {/*                    onClick={() => setIsModalVisible(true)}*/}
                    {/*                />*/}
                    {/*            </Tooltip>*/}
                    {/*            <Tooltip title="Выход">*/}
                    {/*                <Button*/}
                    {/*                    type="text"*/}
                    {/*                    icon={<LogoutOutlined />}*/}
                    {/*                    onClick={() => router.push('/platform/courses')}*/}
                    {/*                />*/}
                    {/*            </Tooltip>*/}
                    {/*        </>*/}
                    {/*    ) : (*/}
                    {/*        <Dropdown*/}
                    {/*            trigger={['click']}*/}
                    {/*            menu={{*/}
                    {/*                items: menuItems,*/}
                    {/*            }}*/}
                    {/*        >*/}
                    {/*            <Button*/}
                    {/*                type="text"*/}
                    {/*                icon={<EllipsisOutlined />}*/}
                    {/*            />*/}
                    {/*        </Dropdown>*/}
                    {/*    )}*/}
                    {/*</div>*/}
                </Sider>



                <Layout className={`${collapsed ? "ml-20" : "ml-72"}`}>
                    <Content style={{
                        margin: 0,
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#f5f5f5',
                        height: 'calc(100vh - 64px)',
                        overflowY: 'auto',
                    }} className="flex flex-col pl-6 py-4 pr-4 max-h-[calc(100vh-64px)] overflow-y-auto">
                        <Card
                            loading={courseStore.loadingSection}
                            bordered={false}
                            title={
                                <div className="space-y-2 my-4"> {/* Добавляем отступ между элементами */}
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {courseStore.fullDetailCourse?.name}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {courseStore.fullDetailCourse?.small_description}
                                    </p>
                                </div>
                            }
                        >
                            {
                                courseStore.fullDetailCourse?.components.map((component) => {
                                    if (component.componentTask.type === CourseComponentType.Text) {
                                        return <TextComponent key={component.id} component={component.componentTask}/>
                                    }
                                    if (component.componentTask.type === CourseComponentType.Quiz) {
                                        return <QuizComponent key={component.id} quiz={component.componentTask}
                                                              currentSection={selectedSection}/>;
                                    }
                                    if (component.componentTask.type === CourseComponentType.MultiPlayChoice) {
                                        return <QuizMultiComponent key={component.id} quiz={component.componentTask}/>;
                                    }
                                })}


                            <Divider/>
                            <div className="space-y-12">
                                {/* Files Section */}
                                <div className="mt-6">
                                    <h2 className="text-2xl font-extrabold mb-6 text-gray-900">📂 Дополнительный материал</h2>
                                    <List
                                        grid={{
                                            gutter: 12,
                                            xs: 1,
                                            sm: 2,
                                            md: 3,
                                            lg: 4,
                                            xl: 5,
                                        }}
                                        dataSource={courseStore.fullDetailCourse?.files || []}
                                        renderItem={(file) => (
                                            <List.Item>
                                                <Card
                                                    hoverable
                                                    className="flex flex-col items-center text-center p-4 shadow-md rounded-lg transform transition-transform hover:scale-105 hover:shadow-lg bg-white border border-gray-200"
                                                    style={{
                                                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
                                                    }}
                                                >
                                                    <div
                                                        className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-500 mb-3">
                                                        {getFileIcon(file.fileName)}
                                                    </div>
                                                    <Typography.Text
                                                        className="text-sm font-medium text-gray-700 truncate">
                                                        <Link href={`${nextConfig.env?.API_URL}${file.filePath}`}
                                                              className="hover:text-blue-400 transition-colors">
                                                            {file.fileName}
                                                        </Link>
                                                    </Typography.Text>
                                                </Card>
                                            </List.Item>
                                        )}
                                    />

                                </div>

                                {/* External Links Section */}
                                <div className="mt-6">
                                    <h2 className="text-2xl font-extrabold mb-6 text-gray-900">🔗 Полезные ссылки</h2>
                                    <List
                                        grid={{
                                            gutter: 16,
                                            xs: 1,
                                            sm: 2,
                                            md: 3,
                                            lg: 3,
                                            xl: 4,
                                        }}
                                        dataSource={courseStore.fullDetailCourse?.links || []}
                                        renderItem={(link) => (
                                            <List.Item>
                                                <Card
                                                    hoverable
                                                    className="p-6 shadow-md rounded-xl transform transition-transform hover:scale-105 hover:shadow-lg bg-gradient-to-b from-white to-green-50"
                                                    style={{
                                                        boxShadow: '0 6px 14px rgba(0, 0, 0, 0.1)',
                                                    }}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div
                                                            className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600">
                                                            🌐
                                                        </div>
                                                        <Typography.Text
                                                            className="text-lg font-semibold text-blue-700 truncate">
                                                            <a href={link.link} target="_blank"
                                                               rel="noopener noreferrer"
                                                               className="hover:text-blue-500 transition-colors">
                                                                {link.link}
                                                            </a>
                                                        </Typography.Text>
                                                    </div>
                                                </Card>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            </div>

                        </Card>
                    </Content>
                </Layout>
            </Layout>
        </Layout>

    );
}

export default observer(LessonPage);