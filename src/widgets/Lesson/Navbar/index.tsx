import {
    Menu,
    Layout,
    Button,
    Tooltip,
    Skeleton,
} from "antd";
import { FC, useEffect, useState } from "react";
import {
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    QuestionCircleOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMobxStores } from "@/shared/store/RootStore";
import { SectionMenu } from "@/shared/api/course/model";

const { Sider } = Layout;

interface NavbarLessonProps {
    courseId: number;
}

export const NavbarLesson: FC<NavbarLessonProps> = observer(({ courseId }) => {
    const { courseStore } = useMobxStores();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [collapsed, setCollapsed] = useState(false);
    const [selectedSection, setSelectedSection] = useState<number | null>(null);

    const handleMenuClick = (key: number) => {
        courseStore.updateSectionStep(key).then(() => {
            setSelectedSection(key);
            router.push(`?step=${key}`);
        });
    };

    const renderIcon = (menuItem: SectionMenu) => {
        const { userAnswer } = menuItem;
        const iconStyles = {
            marginRight: 8,
            fontSize: 25,
            marginBottom: collapsed ? 16 : undefined,
            marginLeft: collapsed ? -4 : undefined,
        };

        if (!userAnswer) {
            return (
                <Tooltip title="Этап не пройден">
                    <QuestionCircleOutlined style={{ ...iconStyles, color: "gray" }} />
                </Tooltip>
            );
        }

        debugger
        const { confirmedStep, totalAnswers, correctAnswers } = userAnswer;

        if (confirmedStep) {
            return (
                <Tooltip title="Этап пройден">
                    <CheckCircleOutlined style={{ ...iconStyles, color: "green" }} />
                </Tooltip>
            );
        }

        let icon = <ExclamationCircleOutlined style={{ ...iconStyles, color: "orange" }} />;
        let tooltipTitle = `Часть заданий выполнена верно (${correctAnswers}/${totalAnswers})`;

        if (correctAnswers === totalAnswers) {
            icon = <CheckCircleOutlined style={{ ...iconStyles, color: "green" }} />;
            tooltipTitle = `Все задания выполнены верно (${correctAnswers}/${totalAnswers})`;
        } else if (correctAnswers === 0) {
            icon = <CloseCircleOutlined style={{ ...iconStyles, color: "red" }} />;
            tooltipTitle = `Все задания выполнены неверно (0/${totalAnswers})`;
        }

        return <Tooltip title={tooltipTitle}>{icon}</Tooltip>;
    };

    useEffect(() => {
        const step = Number(searchParams.get("step"));
        const initialSectionId = step || courseStore.courseMenuItems?.sections?.[0]?.children?.[0]?.id;

        if (initialSectionId) {
            setSelectedSection(initialSectionId);
        }

        if (!step && initialSectionId) {
            router.push(`/platform/lessons/${courseId}?step=${initialSectionId}`);
        }
    }, [searchParams, courseId]);

    return (
        <Sider
            collapsed={collapsed}
            breakpoint="lg"
            onCollapse={setCollapsed}
            width={300}
            style={{ height: "calc(100vh - 64px)" }}
        >
            <div className="flex justify-end px-3">
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined size={30} /> : <MenuFoldOutlined size={30} />}
                    onClick={() => setCollapsed(!collapsed)}
                />
            </div>

            {courseStore.courseMenuItems ? (
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultOpenKeys={courseStore.courseMenuItems?.sections?.map((section) => section.id.toString()) || []}
                    selectedKeys={[selectedSection?.toString() || ""]}
                    onClick={(info) => handleMenuClick(Number(info.key))}
                    className="h-[calc(100vh-96px)] overflow-y-auto custom-scrollbar"
                    style={{ paddingBottom: 20 }}
                    items={[
                        ...courseStore.courseMenuItems?.sections?.map((section) => ({
                            key: section.id.toString(),
                            label: (
                                <Tooltip title={collapsed ? section.name : ""} placement="right">
                                    <span className="font-bold text-white truncate">{section.name}</span>
                                </Tooltip>
                            ),
                            children: section.children.map((child) => ({
                                key: child.id.toString(),
                                label: (
                                    <div className="flex items-center justify-between px-4 py-2 border-l-2 border-green-500">
                                        <p>{child.name}</p>
                                    </div>
                                ),
                                icon: renderIcon(child),
                            })),
                        })),
                        { type: "divider" },
                        {
                            key: "-1",
                            label: (
                                <div className="flex items-center justify-between">
                                    <p className="text-gray-400">Экзамен</p>
                                </div>
                            ),
                            icon: (
                                <Tooltip title="Пока нельзя перейти к экзамену">
                                    <ExclamationCircleOutlined style={{ color: "#1976d2", fontSize: 25, opacity: 0.5 }} />
                                </Tooltip>
                            ),
                        },
                    ]}
                />
            ) : (
                Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton.Input key={index} active block style={{ width: 250, marginLeft: 10, marginTop: 10 }} />
                ))
            )}
        </Sider>
    );
});
