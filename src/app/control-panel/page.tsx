"use client";
import React, { useState, useEffect, Suspense } from "react";
import {
    Card,
    Divider,
    Input,
    Tooltip,
    Typography,
    Row,
    Col,
    Statistic,
    Progress, Skeleton, Spin, Button,
} from "antd";
import { observer } from "mobx-react";
import {
    QuestionCircleOutlined,
    UserOutlined,
    FileTextOutlined,
    BookOutlined, SmileOutlined, CloudOutlined, MoonOutlined, UnorderedListOutlined,
} from "@ant-design/icons";
import { useMobxStores } from "@/stores/stores";
import { welcomeTextRender } from "@/utils/welcomeText";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { getCookieUserDetails } from "@/lib/users";
import { UserRole } from "@/enums/UserRoleEnum";

const ControlPanel = () => {
    const { statisticsStore } = useMobxStores();
    const [currentUser, setCurrentUser] = useState(null);
    const [currentDate, setCurrentDate] = useState<string | null>(null);
    const router = useRouter();
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(dayjs().locale('ru').format('DD MMMM YYYY, HH:mm:ss'));
        }, 1000);

        statisticsStore.getAllStatisticsData();

        // Очистка интервала при размонтировании компонента
        return () => clearInterval(interval);
    }, []);
    const [isModalVisible, setIsModalVisible] = useState(false);
    // Открыть/закрыть модальное окно
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Выбор иконки в зависимости от времени суток
    const renderIcon = () => {
        const currentHours = dayjs().hour();
        if (currentHours >= 6 && currentHours < 12) {
            return <SmileOutlined className="text-yellow-400 text-4xl" />; // Утро
        } else if (currentHours >= 12 && currentHours < 18) {
            return <CloudOutlined className="text-orange-400 text-4xl" />; // День
        } else {
            return <MoonOutlined className="text-blue-400 text-4xl" />; // Ночь
        }
    };

    useEffect(() => {
        const currentUser = getCookieUserDetails();
        setCurrentUser(currentUser);
    }, [])


    return (
        <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto rounded custom-height-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-center p-6 bg-gradient-to-r from-green-300 via-blue-300 to-purple-400 rounded-xl shadow-lg">
                    <div className="flex items-center space-x-4">
                        {/* Иконка с подсказкой */}
                        <Tooltip title="Текущее время суток">{renderIcon()}</Tooltip>
                        <div className="flex flex-col">
                            <p className="text-2xl font-bold text-white">{welcomeTextRender()}</p>
                            {currentDate ? (
                                <p className="text-lg text-gray-100">{currentDate}</p>
                            ) : <Skeleton.Input size="small" />}
                        </div>
                    </div>
                </div>
                <div className="flex items-center w-1/2 gap-3 relative">
                    <Tooltip
                        title="Вы можете найти любую информацию в этом поле ввода"
                        placement="bottomLeft"
                    >
                        <QuestionCircleOutlined />
                    </Tooltip>
                    <Input placeholder="Поиск" allowClear
                        onBlur={() => statisticsStore.setVisibleResultModal(false)}
                        onFocus={() => statisticsStore.setVisibleResultModal(true)}
                        onChange={(e) => statisticsStore.setSearchGlobalText(e.target.value)}
                    />

                    {statisticsStore.visibleResultModal && <div className="absolute bg-white border-2 top-8 z-20 left-8 w-11/12 h-80">
                        {statisticsStore.resultGlobalSearch.map((item, index) => {
                            return <div key={index}>{item.courses.map(course => (
                                <div key={course.id}>{course.name}</div>
                            ))}{item.posts.map(post => (
                                <div key={post.id}>{post.name}</div>
                            ))}</div>
                        })}
                    </div>}
                </div>
            </div>
            <Divider />
            <Typography.Title className="text-gray-800">
                {currentUser?.user.role === UserRole.MODERATOR ? "Панель модератора" : "Админ-панель"}
            </Typography.Title>

            <Row gutter={16}>
                <Col span={8}>
                    <Card title="Активные пользователи" extra={
                        <Tooltip title="Перейти к пользователям">
                            <UnorderedListOutlined onClick={() => router.push('/control-panel/users')} />
                        </Tooltip>
                    }>
                        <Skeleton active paragraph={{ rows: 1 }} loading={statisticsStore.loadingStatisticsData}>
                            <Statistic
                                value={0}
                                prefix={<UserOutlined />}
                            />
                        </Skeleton>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Всего постов" extra={
                        <Tooltip title="Перейти к постам">
                            <UnorderedListOutlined onClick={() => router.push('/control-panel/posts')} />
                        </Tooltip>
                    }>
                        <Skeleton active paragraph={{ rows: 1 }} loading={statisticsStore.loadingStatisticsData}>
                            <div className="flex justify-between items-center">
                                <Statistic
                                    value={statisticsStore.statisticsData?.postCount}
                                    prefix={<FileTextOutlined style={{ fontSize: '24px' }} />}
                                />
                            </div>
                        </Skeleton>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Всего курсов" extra={
                        <Tooltip title="Перейти к курсам">
                            <UnorderedListOutlined onClick={() => router.push('/control-panel/courses')} />
                        </Tooltip>
                    }>
                        <Skeleton active paragraph={{ rows: 1 }} loading={statisticsStore.loadingStatisticsData}>
                            <div className="flex justify-between items-center">
                                <Statistic
                                    value={statisticsStore.statisticsData?.courseCount}
                                    prefix={<BookOutlined style={{ fontSize: '24px' }} />}
                                />
                            </div>
                        </Skeleton>
                    </Card>
                </Col>
            </Row>

            <Divider />
            <Row gutter={16}>
                <Col span={12}>
                    <Card title="Статистика постов">
                        <div className="flex justify-between">
                            <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                                <Progress
                                    type="circle"
                                    strokeColor="green"
                                    percent={statisticsStore.statisticsData?.postsCountPublish}
                                    format={(percent) => <p className="text-sm leading-5">{`${percent}% опубликовано`}</p>}
                                />
                            </Skeleton>
                            <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                                <Progress
                                    type="circle"
                                    percent={statisticsStore.statisticsData?.postsCountNew}
                                    format={(percent) => <p className="text-sm leading-5">{`${percent}% новых`}</p>}
                                />
                            </Skeleton>
                            <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                                <Progress
                                    type="circle"
                                    strokeColor="orange"
                                    percent={statisticsStore.statisticsData?.postsCountIsProcessing}
                                    format={(percent) => <p className="text-sm leading-5">{`${percent}% в обработке`}</p>}
                                />
                            </Skeleton>
                            <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                                <Progress
                                    type="circle"
                                    strokeColor="red"
                                    percent={statisticsStore.statisticsData?.postsCountReject}
                                    format={(percent) => <p className="text-sm leading-5">{`${percent}% откланеных`}</p>}
                                />
                            </Skeleton>
                        </div>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Статистика постов">
                        <div className="flex justify-between">
                            <Progress
                                type="circle"
                                percent={60}
                                strokeColor="green"
                                format={(percent) => <p className="text-lg leading-5">{`${percent}% завершено`}</p>}
                            />
                            <Progress
                                type="circle"
                                percent={60}
                                format={(percent) => <p className="text-lg leading-5">{`${percent}% завершено`}</p>}
                            />
                            <Progress
                                type="circle"
                                percent={60}
                                strokeColor="orange"
                                format={(percent) => <p className="text-lg leading-5">{`${percent}% завершено`}</p>}
                            />
                            <Progress
                                type="circle"
                                percent={60}
                                strokeColor="red"
                                format={(percent) => <p className="text-lg leading-5">{`${percent}% завершено`}</p>}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default observer(ControlPanel);
