import {
    Menu,
    Layout,
    Button,
    Tooltip,
    Skeleton,
    notification
} from "antd";
import { FC, useEffect, useState } from "react";
import {
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    QuestionCircleOutlined
} from "@ant-design/icons";
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { observer } from "mobx-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMobxStores } from "@/shared/store/RootStore";
import { CourseMenu } from "@/shared/api/course/model";

const { Sider } = Layout;

interface NavbarLessonProps {
    courseId: number
}

export const NavbarLesson: FC<NavbarLessonProps> = observer(({ courseId }) => {
    const { courseStore, commentsStore } = useMobxStores()
    const router = useRouter()
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const [selectedSection, setSelectedSection] = useState<number>(0);


    // переход между разделами
    const handleMenuClick = ({ key }: any) => {
        setSelectedSection(key);
        courseStore.updateSectionStep(Number(selectedSection));
        router.push(`/platform/lessons/${courseId}?step=${key}`);
    };

    const renderIconCountAnswerUser = (menuItem: CourseMenu) => {
        if (!menuItem.userAnswer) {
            return (
                <Tooltip title={!collapsed ? "Этап не пройден" : ""} overlayInnerStyle={{ whiteSpace: "pre-wrap" }}>
                    <div className="confirmed-icon">
                        <QuestionCircleOutlined style={{ color: "gray", marginRight: "8px", fontSize: 25, marginBottom: collapsed ? 16 : undefined, marginLeft: collapsed ? -4 : undefined }} />
                    </div>
                </Tooltip>
            );
        }

        const { confirmedStep, totalAnswers, correctAnswers } = menuItem.userAnswer;

        if (confirmedStep) {
            return (
                <Tooltip title={!collapsed ? "Этап пройден" : ""} overlayInnerStyle={{ whiteSpace: "pre-wrap" }}>
                    <div className="confirmed-icon">
                        <CheckCircleOutlined style={{ color: "green", marginRight: "8px", fontSize: 25, marginBottom: collapsed ? 16 : undefined, marginLeft: collapsed ? -4 : undefined }} />
                    </div>
                </Tooltip>
            );
        }

        let icon = null;
        let tooltipTitle = "";

        if (correctAnswers === totalAnswers) {
            icon = <CheckCircleOutlined style={{ color: "green", marginRight: "8px", fontSize: 25, marginBottom: collapsed ? 16 : undefined, marginLeft: collapsed ? -4 : undefined }} />;
            tooltipTitle = `Все задания выполнены верно (${correctAnswers}/${totalAnswers})`;
        } else if (correctAnswers === 0) {
            icon = <CloseCircleOutlined style={{ color: "red", marginRight: "8px", fontSize: 25, marginBottom: collapsed ? 16 : undefined, marginLeft: collapsed ? -4 : undefined }} />;
            tooltipTitle = `Все задания выполнены неверно (0/${totalAnswers})`;
        } else {
            icon = <ExclamationCircleOutlined style={{ color: "orange", marginRight: "8px", fontSize: 25, marginBottom: collapsed ? 16 : undefined, marginLeft: collapsed ? -4 : undefined }} />;
            tooltipTitle = `Часть заданий выполнена верно (${correctAnswers}/${totalAnswers})`;
        }

        return (
            <Tooltip title={!collapsed ? tooltipTitle : ""} overlayInnerStyle={{ whiteSpace: "pre-wrap" }}>
                <div className="confirmed-icon">
                    {icon}
                </div>
            </Tooltip>
        );
    };

    useEffect(() => {
        const step = Number(searchParams.get('step'))
        const initialSectionId = step || courseStore.courseMenuItems?.children[0].children[0].id

        commentsStore.getSectionComments(Number(initialSectionId));

        if (!step) {
            router.push(`/platform/lessons/${courseId}?step=${initialSectionId}`);
        }
    }, [])

    return (
        <Sider
            collapsed={collapsed}
            breakpoint="lg"
            onCollapse={(value) => setCollapsed(value)}
            width={300}
            // className="fixed top-16"
            style={{ height: "calc(100vh - 64px)" }}
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
                    <>
                        <Menu
                            theme="dark"
                            mode="inline"
                            defaultOpenKeys={courseStore.courseMenuItems?.sections?.map((section) => section.id.toString()) || []}
                            selectedKeys={[selectedSection.toString()]}
                            items={[
                                ...courseStore.courseMenuItems?.sections?.map((section) => {
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
                                        children: section.children.map((child) => ({
                                            key: child.id.toString(),
                                            label: (
                                                <div
                                                    className="flex items-center justify-between"
                                                    style={{
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
                                }),
                                { type: "divider" },
                                {
                                    key: '-1',
                                    label: (
                                        <div className="flex items-center justify-between">
                                            <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Экзамен</p>
                                        </div>
                                    ),
                                    icon: (
                                        <Tooltip title="Пока нельзя перейти к экзамену" placement="top">
                                            <ExclamationCircleOutlined style={{ color: '#1976d2', fontSize: 25, opacity: 0.5 }} />
                                        </Tooltip>
                                    ),
                                }
                            ]}
                            style={{ paddingBottom: 20 }}
                            className="h-[calc(100vh-96px)] overflow-y-auto custom-scrollbar"
                            onClick={handleMenuClick}
                        />
                    </>
                ) : (
                    <>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(it => (
                            <Skeleton.Input key={it} active block style={{ width: 250, marginLeft: 10, marginTop: 10 }} />
                        ))}
                    </>
                )
            }
        </Sider>
    )
})