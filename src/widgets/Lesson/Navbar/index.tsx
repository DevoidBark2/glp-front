import {
    Menu,
    Layout,
    Button,
    Tooltip,
    Skeleton, Spin, Progress,
} from "antd";
import React, { useEffect, useState } from "react";
import {
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    QuestionCircleOutlined, HomeOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMobxStores } from "@/shared/store/RootStore";
import { SectionMenu } from "@/shared/api/course/model";
import Image from "next/image";

const { Sider } = Layout;

export const NavbarLesson = observer(() => {
    const { courseStore } = useMobxStores();
    const { courseId } = useParams()
    const router = useRouter();
    const searchParams = useSearchParams();
    const [collapsed, setCollapsed] = useState(false);
    const [selectedSection, setSelectedSection] = useState<number | null>(null);

    const handleMenuClick = (key: number) => {
        courseStore.updateSectionStep(Number(selectedSection)).then(() => {
            setSelectedSection(key);
            router.push(`?step=${key}`);
        });
        setIsHovered(false)

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

        if ("confirmedStep" in userAnswer) {
            return (
                <Tooltip title="Этап пройден">
                    <CheckCircleOutlined style={{ ...iconStyles, color: "green" }} />
                </Tooltip>
            );
        }

        const totalAnswers = userAnswer.totalAnswers;
        const correctAnswers = userAnswer.correctAnswers

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


    const [windowW, setWindowW] = useState<number | null>(null)
    const [isMobile, setIsMobile] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleResize = () => {
        setWindowW(window.innerWidth)
        console.log(window.innerWidth)
        if (window.innerWidth <= 768) {
            setIsMobile(true)
        }
        else {
            setIsMobile(false)
        }


        useEffect(() => {
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, [windowW]);
    };

    const handleSetIsMobile = () => {
        window.localStorage.setItem("platform_mobile", String(!isMobile))
        setIsMobile(prevState => !prevState)
    }

    useEffect(() => {
        const step = Number(searchParams.get("step"));
        const initialSectionId = step || courseStore.courseMenuItems?.sections?.[0]?.children?.[0]?.id;
        const isMobile = window.localStorage.getItem("platform_mobile")
        setWindowW(window.innerWidth)
        if (isMobile) {
            setIsMobile(!!isMobile)
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
            {isMobile && (
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
                    position: isMobile ? "fixed" : "static",
                    left: isMobile && !isHovered ? "-240px" : "0",
                    height: "calc(100vh - 64px)",
                    zIndex: 1100,
                    transition: "left 0.3s ease-in-out",
                }}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex justify-end px-3">
                    <Button
                        type="text"
                        icon={!isMobile ? <Image
                            src="/static/pin_icon_2.svg"
                            alt="pin"
                            width={30}
                            height={30}
                            color="white"
                        /> : <Image
                            src="/static/pin_icon.svg"
                            alt="pin"
                            width={30}
                            height={30}
                            color="white"
                        />}
                        onClick={() => handleSetIsMobile()}
                    />
                </div>

                <div className="flex-1 mx-4">
                    <p className='text-white text-xl text-center'>Прогресс по курсу</p>
                    {!courseStore.courseMenuLoading && (
                        <Progress
                            percent={courseStore.courseMenuItems?.progress}
                            strokeColor="green"
                            trailColor="#CCCCCC"
                            showInfo={true}
                            format={(percent) => (
                                <span className="text-white font-bold">{percent}%</span>
                            )}
                        />
                    )}
                </div>

                {courseStore.courseMenuItems ? (
                    <Menu
                        theme="dark"
                        mode="inline"
                        openKeys={!collapsed && courseStore.courseMenuItems?.sections?.map((section) => section.id?.toString() || "") || []}
                        expandIcon={() => null}
                        selectedKeys={[selectedSection?.toString() || ""]}
                        onClick={(info) => handleMenuClick(Number(info.key))}
                        className="h-[calc(100vh-96px)] overflow-y-auto custom-scrollbar"
                        style={{ paddingBottom: 100 }}
                        items={[
                            ...(courseStore.courseMenuItems?.sections?.map((section) => ({
                                key: section.id?.toString(),
                                label: (<span className="font-bold text-white truncate">{section.name}</span>),
                                children: section.children?.map((child) => ({
                                    key: child.id?.toString(),
                                    icon: renderIcon(child),
                                    label: (
                                        <div
                                            className="flex items-center justify-between px-4 py-2 border-l-2 border-green-500">
                                            <p className="truncate">{child.name}</p>
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
                                        <ExclamationCircleOutlined
                                            style={{ color: "#1976d2", fontSize: 25, opacity: 0.5 }} />
                                    </Tooltip>
                                ),
                                // disabled: true,
                            },
                        ]}
                    />


                ) : (
                    <div className="h-[calc(100vh-96px)] custom-scrollbar">
                        {
                            Array.from({ length: 8 }).map((_, index) => (
                                <Skeleton.Input key={index} active block
                                    style={{ width: 230, marginLeft: 10, marginTop: 10 }} />
                            ))
                        }
                    </div>
                )}
            </Sider>
        </>
    );
});
