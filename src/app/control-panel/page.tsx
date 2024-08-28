"use client";
import React, { useState, useEffect } from "react";
import {
    Card,
    Divider,
    Input,
    Tooltip,
    Typography,
    Row,
    Col,
    Statistic,
    Progress, Skeleton,
} from "antd";
import { observer } from "mobx-react";
import {
    QuestionCircleOutlined,
    UserOutlined,
    FileTextOutlined,
    BookOutlined,
} from "@ant-design/icons";
import {useMobxStores} from "@/stores/stores";
import {welcomeTextRender} from "@/utils/welcomeText";

const ControlPanel = () => {
    const [currentDate, setCurrentDate] = useState<string>("");
    const {statisticsStore} = useMobxStores();

    useEffect(() => {
        setCurrentDate(welcomeTextRender);
        statisticsStore.getAllStatisticsData();
    }, []);

    return (
        <div className="bg-white h-full p-5 shadow-2xl overflow-y-auto" style={{height: 'calc(100vh - 60px)'}}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <p className="text-xl text-gray-400">{currentDate}</p>
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
                        {statisticsStore.resultGlobalSearch.map((item,index) => {
                            return <div key={index}>{item.courses.map(course => (
                                <div key={course.id}>{course.name}</div>
                            ))}{item.posts.map(post => (
                                <div key={post.id}>{post.name}</div>
                            ))}</div>
                        })}
                    </div>}


                    {/*<Popover*/}
                    {/*    content={*/}
                    {/*        <List*/}
                    {/*            size="small"*/}
                    {/*            dataSource={notifications}*/}
                    {/*            renderItem={(item) => (*/}
                    {/*                <List.Item>*/}
                    {/*                    <Badge status="processing" text={item.message} />*/}
                    {/*                    <div style={{ marginLeft: "auto" }}>{item.time}</div>*/}
                    {/*                </List.Item>*/}
                    {/*            )}*/}
                    {/*        />*/}
                    {/*    }*/}
                    {/*    title="Уведомления"*/}
                    {/*    trigger="click"*/}
                    {/*>*/}
                    {/*    <Button type="primary" shape="circle" icon={<BellOutlined />} />*/}
                    {/*</Popover>*/}
                </div>
            </div>
            <Divider />
            <Typography.Title className="text-gray-800">
                Админ-панель
            </Typography.Title>

            <Row gutter={16}>
                <Col span={8}>
                    <Card>
                        <Skeleton active paragraph={{rows: 1}} loading={statisticsStore.loadingStatisticsData}>
                            <Statistic
                                title="Активные пользователи"
                                value={0}
                                prefix={<UserOutlined />}
                            />
                        </Skeleton>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                       <Skeleton active paragraph={{rows: 1}} loading={statisticsStore.loadingStatisticsData}>
                           <Statistic
                               title="Всего постов"
                               value={statisticsStore.statisticsData?.postCount}
                               prefix={<FileTextOutlined />}
                           />
                       </Skeleton>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                      <Skeleton active paragraph={{rows: 1}} loading={statisticsStore.loadingStatisticsData}>
                          <Statistic
                              title="Всего курсов"
                              value={statisticsStore.statisticsData?.courseCount}
                              prefix={<BookOutlined />}
                          />
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
