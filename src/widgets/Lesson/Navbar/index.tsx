import {
    Menu,
    Layout,
    Button,
    Tooltip,
    Skeleton,
    Progress,
} from "antd";
import React, { useEffect, useState } from "react";
import {
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    QuestionCircleOutlined,
    PushpinOutlined,
    PushpinTwoTone,
} from "@ant-design/icons";
import { observer } from "mobx-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMobxStores } from "@/shared/store/RootStore";
import { SectionMenu } from "@/shared/api/course/model";
import { useMediaQuery } from "react-responsive";
import { useTheme } from "next-themes";

const { Sider } = Layout;

export const NavbarLesson = observer(() => {
    const { courseStore } = useMobxStores();
    const { courseId } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedSection, setSelectedSection] = useState<number | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const isTablet = useMediaQuery({ query: "(max-width: 768px)" });
    const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });
    const { resolvedTheme } = useTheme()
    const [isPinned, setIsPinned] = useState<boolean>();

    const handleMenuClick = (key: number) => {
        courseStore.updateSectionStep(Number(selectedSection),Number(courseId)).then(() => {
            setSelectedSection(key);
            router.push(`?step=${key}`);
        });
        setIsHovered(false);
    };

    const renderIcon = (menuItem: SectionMenu) => {
        const { userAnswer } = menuItem;
        const iconStyles = {
            marginRight: 8,
            fontSize: 25,
        };

        if (!userAnswer) {
            return (
                <Tooltip title="Этап не пройден">
                    <QuestionCircleOutlined style={{ ...iconStyles, color: "gray" }} />
                </Tooltip>
            );
        }

        if ("confirmedStep" in userAnswer) {
            return (
                <Tooltip title="Этап пройден">
                    <CheckCircleOutlined style={{ ...iconStyles, color: "green" }} />
                </Tooltip>
            );
        }

        const totalAnswers = userAnswer.totalAnswers;
        const correctAnswers = userAnswer.correctAnswers;

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

    const handlePinToggle = () => {
        const newState = !isPinned;
        setIsPinned(newState);
        localStorage.setItem("sider_pinned", String(newState));
    };

    useEffect(() => {
        const step = Number(searchParams.get("step"));
        const initialSectionId = step || courseStore.courseMenuItems?.sections?.[0]?.children?.[0]?.id;
        const isSnipped = localStorage.getItem("sider_pinned") === "true"

        if (isSnipped) {
            setIsPinned(isSnipped)
        }

        if (initialSectionId) {
            setSelectedSection(initialSectionId);
        }

        if (!step && initialSectionId) {
            router.push(`/platform/lessons/${courseId}?step=${initialSectionId}`);
        }
    }, [searchParams, courseId]);

    return (
        <>
            {isSmallScreen && (
                <div
                    className="h-full w-6 bg-gray-400 z-50 flex items-center justify-center"
                    onMouseEnter={() => setIsHovered(true)}
                >
                    <div className="transform -rotate-90 whitespace-nowrap text-white text-sm">
                        Наведите
                    </div>
                </div>
            )}

            <Sider
                width={240}
                style={{
                    position: isTablet ? "fixed" : "static",
                    left: isSmallScreen
                        ? isHovered
                            ? "0"
                            : "-240px"
                        : isPinned || isHovered
                            ? "0"
                            : "-240px",
                    height: "calc(100vh - 56px)",
                    zIndex: 100,
                    background: resolvedTheme === "dark" ? "" : "white",
                    transition: "left 0.3s ease-in-out",
                    boxShadow: "4px 0 10px rgba(0, 0, 0, 0.2)"
                }}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex justify-end px-3">
                    {!isSmallScreen && (
                        <Button
                            type="text"
                            icon={
                                isPinned ? (
                                    <PushpinOutlined style={{ fontSize: 20, color: resolvedTheme === "dark" ? "white" : "black" }} />
                                ) : (
                                    <PushpinTwoTone style={{ fontSize: 20, color: resolvedTheme === "dark" ? "white" : "black" }} />
                                )
                            }
                            onClick={handlePinToggle}
                        />
                    )}
                </div>

                <div className="flex-1 mx-4 mb-4 dark:bg-[#1a1a1a]">
                    <p className="dark:text-white text-xl text-center mt-2">Прогресс по курсу</p>
                    {!courseStore.courseMenuLoading && (
                        <Progress
                            percent={courseStore.courseMenuItems?.progress}
                            strokeColor="green"
                            trailColor="#CCCCCC"
                            showInfo={true}
                            format={(percent) => (
                                <span className="dark:text-white font-bold">{percent}%</span>
                            )}
                        />
                    )}
                </div>

                {courseStore.courseMenuItems ? (
                    <Menu
                        mode="inline"
                        openKeys={courseStore.courseMenuItems?.sections?.map((section) => section.id?.toString() || "") || []}
                        expandIcon={() => null}
                        selectedKeys={[selectedSection?.toString() || ""]}
                        onClick={(info) => handleMenuClick(Number(info.key))}
                        className="h-[calc(100vh-96px)] overflow-y-auto custom-scrollbar"
                        style={{
                            paddingBottom: 50,
                            background: resolvedTheme === "dark" ? "#1a1a1a" : "white",
                        }}
                        items={[
                            { type: "divider" },
                            ...(courseStore.courseMenuItems?.sections?.map((section) => ({
                                key: section.id?.toString(),
                                label: <Tooltip title={section.name}>
                                    <span className="font-bold truncate dark:text-white">{section.name}</span>
                                </Tooltip>,
                                children:
                                    section.children?.map((child) => ({
                                        key: child.id?.toString(),
                                        icon: renderIcon(child),
                                        label: (
                                            <div className="flex items-center justify-between px-4 dark:text-white py-2 border-l-2 border-green-500">
                                                <Tooltip title={child.name} placement="right">
                                                    <p className="truncate">{child.name}</p>
                                                </Tooltip>
                                            </div>
                                        ),
                                    })) || [],
                            })) || []),

                            { type: "divider" },

                            {
                                key: "-1",
                                label: <span className="text-gray-400">Экзамен</span>,
                                icon: (
                                    <Tooltip title="Пока нельзя перейти к экзамену">
                                        <ExclamationCircleOutlined style={{ color: "#1976d2", fontSize: 25, opacity: 0.5 }} />
                                    </Tooltip>
                                ),
                            },
                        ]}
                    />
                ) : (
                    <div className="h-[calc(100vh-96px)] custom-scrollbar">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <Skeleton.Input key={index} active block style={{ width: 230, marginLeft: 5, marginTop: 10, marginRight: 5 }} />
                        ))}
                    </div>
                )}
            </Sider>
        </>
    );
});
