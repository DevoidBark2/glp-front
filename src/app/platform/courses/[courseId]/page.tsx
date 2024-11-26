"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Menu, Layout, Card, Progress, Button, Dropdown, Popover, Divider } from "antd";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftOutlined, ArrowRightOutlined, DownOutlined } from "@ant-design/icons";
import { useMobxStores } from "@/stores/stores";
import { Header } from "antd/es/layout/layout";
import { CourseComponentType } from "@/shared/api/course/model";
import { QuizComponent } from "@/entities/course/ui/QuizComponent";
import { QuizMultiComponent } from "@/entities/course/ui/QuizMultiComponent";
import { TextComponent } from "@/entities/course/ui/TextComponent";

const { Sider, Content } = Layout;

const CoursePage = () => {
    const { courseId } = useParams();
    const { courseStore } = useMobxStores();
    const [selectedSection, setSelectedSection] = useState(0);
    const [progress, setProgress] = useState(0);

    const handleMenuClick = ({ key }: any) => {
        debugger
        setSelectedSection(key);
        updateStepInUrl(key);
    };

    const router = useRouter()
    const searchParams = useSearchParams();

    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={() => router.back()}>
                Выйти из курса
            </Menu.Item>
        </Menu>
    );

    const courseDetailsContent = (
        <div>
            <p>Всего заданий: 100</p>
            <p>Сложных заданий: 2</p>
            <p>Легких заданий: 4</p>
            <p>Оценочное время: не указано</p>
        </div>
    );

    const saveLastVisitedSection = (sectionId: string) => {
        localStorage.setItem(`lastVisitedSection_${courseId}`, sectionId);
    };
    
    const getLastVisitedSection = () => {
        return Number(localStorage.getItem(`lastVisitedSection_${courseId}`)) || null;
    };
    
    const updateStepInUrl = (sectionId: number) => {
        router.push(`/platform/courses/${courseId}?step=${sectionId}`, undefined);
        setSelectedSection(sectionId);
    };

    const handleSectionChange = (direction: number) => {
        debugger
        const allSections = courseStore.fullDetailCourse?.sections;

        if (!allSections || allSections.length === 0) return;

        const currentIndex = allSections.findIndex(section => section.id === selectedSection);
        const newIndex = currentIndex + direction;

        if (newIndex >= 0 && newIndex < allSections.length) {
            const newSectionId = allSections[newIndex].id;
            setSelectedSection(newSectionId);
            saveLastVisitedSection(String(newSectionId)); // Сохранение раздела
            updateStepInUrl(newSectionId);
        }
    };

    useEffect(() => {
        courseStore.getFullCourseById(Number(courseId)).then((response) => {
            const stepFromUrl = Number(searchParams.get("step"));
            const initialSectionId = stepFromUrl || response.sections[0]?.id || 0;
            setSelectedSection(initialSectionId);
        });
    }, [courseId, searchParams]);

    return (
        <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
            <Header
                className="fixed w-full top-0 left-0 z-50"
                style={{
                    padding: '0 24px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '64px',
                }}
            >
                <Popover content={courseDetailsContent} placement="topLeft" title="Информация о курсе" trigger="hover">
                    <h1 className="text-xl font-semibold text-gray-800 cursor-pointer">
                        {courseStore.fullDetailCourse?.name || 'Название курса'}
                    </h1>
                </Popover>

                <div style={{ flex: 1, margin: '0 16px' }}>
                    <Progress
                        percent={progress}
                        status="active"
                        strokeColor={{
                            from: '#108ee9',
                            to: '#87d068',
                        }}
                        showInfo={true}
                    />
                </div>

                <Dropdown overlay={menu} trigger={['hover']}>
                    <Button type="primary">
                        Кнопка действия <DownOutlined />
                    </Button>
                </Dropdown>
            </Header>

            <Layout style={{ marginTop: 64 }}>
                <Sider
                    width={300}
                    className="site-layout-background"
                    style={{
                        overflowY: 'auto',
                        height: 'calc(100vh - 64px)',
                        position: 'fixed',
                    }}
                >
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedSection.toString()]}
                        onClick={handleMenuClick}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        {courseStore.fullDetailCourse?.sections.map((section) => (
                            <Menu.Item key={section.id}>
                                {section.name}
                            </Menu.Item>
                        ))}
                    </Menu>
                </Sider>

                <Layout style={{ marginLeft: 300 }}>
                    <Content
                        style={{
                            margin: 0,
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            backgroundColor: '#f5f5f5',
                            height: 'calc(100vh - 64px)',
                            overflowY: 'auto',
                        }}
                    >
                        <Card
                            title={
                                <>
                                    <h2 className="text-2xl font-semibold text-gray-800 mt-4">
                                        {courseStore.fullDetailCourse?.sections.find(
                                            (s) => s.id === Number(selectedSection)
                                        )?.name || 'Section Name'}
                                    </h2>
                                    <Divider />
                                </>
                            }
                            style={{
                                flex: 1,
                                marginBottom: 24,
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            }}
                            bodyStyle={{
                                padding: '24px',
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                            }}
                        >
                            {courseStore.fullDetailCourse?.sections
                                .find((s) => s.id === Number(selectedSection))
                                ?.components.map((component) => {
                                    if (component.type === CourseComponentType.Text) {
                                        return  <TextComponent component={component}/>
                                    }
                                    if (component.type === CourseComponentType.Quiz) {
                                        return <QuizComponent key={component.id} quiz={component} />;
                                    }
                                    if (component.type === CourseComponentType.MultiPlayChoice) {
                                        return <QuizMultiComponent key={component.id} quiz={component} />;
                                    }
                                })}
                        </Card>

                        <div className="flex justify-between my-10">
                            {selectedSection > 0 && (
                                <Button
                                    type="primary"
                                    onClick={() => handleSectionChange(-1)}
                                    icon={<ArrowLeftOutlined />}
                                >
                                    Назад
                                </Button>
                            )}

                            <Button
                                type="primary"
                                onClick={() => handleSectionChange(1)}
                                icon={<ArrowRightOutlined />}
                            >
                                Следующий раздел
                            </Button>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default observer(CoursePage);