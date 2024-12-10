"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import {
    Menu,
    Layout,
    Card,
    Button,
    Tooltip,
    Form,
    Spin,
    Skeleton,Divider,
    notification
} from "antd";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    QuestionCircleOutlined, FileOutlined
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
import Image from "next/image";
import nextConfig from "next.config.mjs";
import Link from "next/link";

const { Sider, Content } = Layout;

const LessonPage = () => {
    const { courseId } = useParams();
    const { courseStore } = useMobxStores();
    const [selectedSection, setSelectedSection] = useState(0);
    const [collapsed, setCollapsed] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    // переход между разделами
    const handleMenuClick = ({ key }: any) => {
        setSelectedSection(key);
        courseStore.updateSectionStep(Number(selectedSection));
        router.push(`/platform/lessons/${courseId}?step=${key}`);
    };

    const renderIconCountAnswerUser = (menuItem: CourseMenu) => {
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
                <Tooltip title={!collapsed ? "Этап пройден" : ""} overlayInnerStyle={{ whiteSpace: "pre-wrap" }}>
                    <div className="confirmed-icon">
                        <CheckCircleOutlined style={{ color: "green", marginRight: "8px", fontSize: 25 }} />
                    </div>
                </Tooltip>
            );
        }

        let icon = null;
        let tooltipTitle = "";

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


    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();

        switch (extension) {
            case 'pdf':
                return <Image src="/static/pdf-icon.svg" alt={extension} width={30} height={30} />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'svg':
            case 'webp':
                return <Image src="/static/png_icon.svg" alt={extension} width={30} height={30} />;
            case 'doc':
            case 'docx':
                return <Image src="/static/word-icon.svg" alt={extension} width={30} height={30} />;
            case 'xlsx':
            case 'xls':
                return <Image src="/static/excel-icon.svg" alt={extension} width={30} height={30} />;
            default:
                return <FileOutlined className="text-gray-400" />;
        }
    };


    useEffect(() => {
        courseStore.getFullCourseById(Number(courseId)).then((response) => {
            const stepFromUrl = Number(searchParams.get("step"));
            const initialSectionId: number = stepFromUrl || response?.sections[0].children[0]?.id;
            setSelectedSection(initialSectionId);

            courseStore.getMenuSections(Number(courseId), initialSectionId)

            if (!stepFromUrl) {
                router.push(`/platform/lessons/${courseId}?step=${initialSectionId}`);
            }
        }).catch(e => {
            router.push(`/platform/courses/${courseId}`);
            notification.error({message: e.response.data.message})
        });

    }, [courseId]);

    useEffect(() => {
        if (Number(selectedSection) !== 0) {
            courseStore.getMenuSections(Number(courseId), Number(selectedSection))
        }

    }, [searchParams])

    return (
        <Layout>
            <Header className="flex items-center justify-between fixed w-full top-0 left-0 z-50 bg-[#001529] h-16">
                {courseStore.courseMenuLoading ? (
                    <Spin />
                ) : (
                    <h1 className="text-xl font-bold text-white">
                        {courseStore.courseMenuItems?.courseName}
                    </h1>
                )}
                <Button
                    onClick={() => router.push('/platform/courses')}
                >Вернутся к курсам</Button>
                {/* <div className="flex-1 mx-4">
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
                </div> */}
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
                            icon={collapsed 
                                ? <MenuUnfoldOutlined size={30} style={{ color: 'white' }} /> 
                                : <MenuFoldOutlined size={30} style={{ color: 'white' }} />
                            }
                            onClick={() => setCollapsed(!collapsed)}
                        />
                    </div>
                    {
                        courseStore.courseMenuItems ? (
                            <Menu
                                theme="dark"
                                mode="inline"
                                selectedKeys={[selectedSection.toString()]}
                                items={courseStore.courseMenuItems?.sections
                                    ?.map((section) => {
                                        return {
                                            key: section.id.toString(),
                                            label: (
                                                <Tooltip title={collapsed && section.name} placement="right">
                                                    <div className="flex items-center overflow-hidden">
                                                        <span className="font-bold text-white truncate">
                                                            {section.name}
                                                        </span>
                                                    </div>
                                                </Tooltip>
                                            ),
                                            icon: <ExclamationCircleOutlined style={{ color: '#d32f2f' }} />,
                                            type: 'group',
                                            children: section.children.map((child) => ({
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
                                                        <p>{child.name}</p>
                                                    </div>
                                                ),
                                                icon: renderIconCountAnswerUser(child),
                                            })),
                                        };
                                    })}
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
                </Sider>

                <Layout className={`${collapsed ? "ml-20" : "ml-72"}`}>
                    <Content style={{height: 'calc(100vh - 64px)'}} className="m-0 p-6 flex flex-col pl-6 py-4 pr-4 max-h-[calc(100vh-64px)] overflow-y-auto">
                        <Card
                            loading={courseStore.loadingSection}
                            bordered={false}
                            title={
                                <div className="space-y-2 my-4">
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
                                {courseStore.fullDetailCourse?.files && courseStore.fullDetailCourse?.files.length > 0 && <div className="mt-6">
                                    <h2 className="text-2xl font-extrabold mb-6 text-gray-900">📂 Дополнительный материал</h2>
                                    <div className="space-y-4">
                                        {(courseStore.fullDetailCourse?.files || []).map((file,index) => (
                                            <div
                                                key={index}
                                                className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500">
                                                    {getFileIcon(file.fileName)}
                                                </div>
                                                <Link
                                                    href={`${nextConfig.env?.API_URL}${file.filePath}`}
                                                    download
                                                    className="ml-4 text-gray-800 font-medium text-sm hover:text-blue-500 transition-colors truncate"
                                                >
                                                    {file.fileName}
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>}

                                {courseStore.fullDetailCourse?.links && courseStore.fullDetailCourse?.links.length > 0 && <div className="mt-6">
                                    <h2 className="text-2xl font-extrabold mb-6 text-gray-900">🔗 Полезные ссылки</h2>
                                    <div className="space-y-4">
                                        {(courseStore.fullDetailCourse?.links || []).map((link, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center p-4 bg-gradient-to-b from-white to-green-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <Image src="/static/browser-icon.svg" alt="Browser" width={30} height={30} />
                                                <Link
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-4 text-blue-700 font-medium text-base hover:text-blue-500 transition-colors truncate"
                                                >
                                                    {link}
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>}
                            </div>
                        </Card>
                    </Content>
                </Layout>
            </Layout>
        </Layout>

    );
}

export default observer(LessonPage);