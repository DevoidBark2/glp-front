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
    MenuFoldOutlined, FolderOutlined,
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
        courseStore.updateSectionStep(Number(selectedSection)).then(() => {
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

        if (!Array.isArray(userAnswer) && userAnswer.confirmedStep) {
            return (
                <Tooltip title="Этап пройден">
                    <CheckCircleOutlined style={{ ...iconStyles, color: "green" }} />
                </Tooltip>
            );
        }

        if (!Array.isArray(userAnswer) && userAnswer.value) {
            const tooltipTitle = userAnswer.isCorrect
                ? `Задание выполнено верно`
                : `Задание выполнено неверно`;

            const icon = userAnswer.isCorrect
                ? <CheckCircleOutlined style={{ ...iconStyles, color: "green" }} />
                : <CloseCircleOutlined style={{ ...iconStyles, color: "red" }} />;

            return <Tooltip title={tooltipTitle}>{icon}</Tooltip>;
        }

        const totalAnswers = Array.isArray(userAnswer) ? userAnswer.length : userAnswer.totalAnswers;
        const correctAnswers = Array.isArray(userAnswer)
            ? userAnswer.filter(answer => answer.isCorrect).length
            : userAnswer.correctAnswers;

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
            {/* Кнопка скрытия/развертывания */}
            <div className="flex justify-end px-3">
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined style={{ color: "white" }} size={30} /> : <MenuFoldOutlined style={{ color: "white" }} size={30} />}
                    onClick={() => setCollapsed(!collapsed)}
                />
            </div>

            {/* Проверяем наличие данных в courseStore */}
            {courseStore.courseMenuItems ? (
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultOpenKeys={courseStore.courseMenuItems?.sections?.map((section) => section.id.toString()) || []}
                    selectedKeys={[selectedSection?.toString() || ""]}
                    onClick={(info) => handleMenuClick(Number(info.key))}
                    className="h-[calc(100vh-96px)] overflow-y-auto custom-scrollbar"
                    style={{ paddingBottom: 20 }}
                >
                    {/* Перебираем разделы курса */}
                    {courseStore.courseMenuItems?.sections?.map((section) => ({
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
                                    <p className="truncate">{child.name}</p>
                                </div>
                            ),
                            icon: renderIcon(child),
                        })),
                    })).map((section) =>
                        collapsed ? (
                            // Если меню свернуто, используем Tooltip для отображения названия
                            <Tooltip key={section.key} title={section.label} placement="right">
                                <Menu.SubMenu key={section.key} icon={<FolderOutlined />}>
                                    {section.children.map((child) => (
                                        <Menu.Item key={child.key} icon={child.icon}>
                                            {child.label}
                                        </Menu.Item>
                                    ))}
                                </Menu.SubMenu>
                            </Tooltip>
                        ) : (
                            <Menu.SubMenu key={section.key} title={section.label} icon={<FolderOutlined />}>
                                {section.children.map((child) => (
                                    <Menu.Item key={child.key} icon={child.icon}>
                                        {child.label}
                                    </Menu.Item>
                                ))}
                            </Menu.SubMenu>
                        )
                    )}

                    {/* Разделитель */}
                    <Menu.Divider />

                    {/* Экзамен (пункт недоступен) */}
                    <Menu.Item
                        key="-1"
                        disabled
                        icon={
                            <Tooltip title="Пока нельзя перейти к экзамену">
                                <ExclamationCircleOutlined style={{ color: "#1976d2", fontSize: 25, opacity: 0.5 }} />
                            </Tooltip>
                        }
                    >
                        <span className="text-gray-400">Экзамен</span>
                    </Menu.Item>
                </Menu>
            ) : (
                // Если данные еще загружаются, показываем заглушку
                Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton.Input key={index} active block style={{ width: 250, marginLeft: 10, marginTop: 10 }} />
                ))
            )}
        </Sider>

    );
});
