"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  Divider,
  Tooltip,
  Typography,
  Row,
  Col,
  Statistic,
  Progress, Skeleton,
} from "antd";
import { observer } from "mobx-react";
import {
  UserOutlined,
  FileTextOutlined,
  BookOutlined, UnorderedListOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useMobxStores } from "@/stores/stores";
import { useRouter } from "next/navigation";
import {PageContainerControlPanel} from "@/shared/ui";
import { UserRole } from "@/shared/api/user/model";

const ControlPanel = () => {
  const { statisticsStore, userProfileStore } = useMobxStores();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    userProfileStore.getUserProfile().then(response => {
      setCurrentUser(response)
    })

    statisticsStore.getAllStatisticsData();
  }, [])

  return (
      <PageContainerControlPanel>
        <div
            className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">
              Добро пожаловать{`, ${currentUser?.first_name ?? ''}`}!
            </h1>
            <p className="text-lg text-gray-100 mt-2">
              Вы вошли
              как {currentUser?.role === UserRole.MODERATOR ? 'Модератор' : currentUser?.role === UserRole.TEACHER ? 'Учитель' : 'Администратор'}.
            </p>
          </div>
        </div>
        <Divider/>
        <Typography.Title className="text-gray-800">
          {currentUser && (currentUser?.role === UserRole.MODERATOR ? "Панель модератора" : currentUser?.role === UserRole.TEACHER ? "Панель Учителя" : "Админ-панель")}
        </Typography.Title>

        <Row gutter={16}>
          {
              currentUser?.role === UserRole.SUPER_ADMIN && <Col span={8}>
                <Card title="Активные пользователи" extra={
                  <Tooltip title="Перейти к пользователям">
                    <UnorderedListOutlined onClick={() => router.push('/control-panel/users')}/>
                  </Tooltip>
                }>
                  <Skeleton active paragraph={{rows: 1}} loading={statisticsStore.loadingStatisticsData}>
                    <Statistic
                        value={statisticsStore.statisticsData?.countUsers}
                        prefix={<UserOutlined/>}
                    />
                  </Skeleton>
                </Card>
              </Col>
          }
          {
              (currentUser?.role === UserRole.SUPER_ADMIN || currentUser?.role === UserRole.TEACHER) && <Col span={8}>
                <Card title="Всего постов" extra={
                  <Tooltip title="Перейти к постам">
                    <UnorderedListOutlined onClick={() => router.push('/control-panel/posts')}/>
                  </Tooltip>
                }>
                  <Skeleton active paragraph={{rows: 1}} loading={statisticsStore.loadingStatisticsData}>
                    <div className="flex justify-between items-center">
                      <Statistic
                          value={statisticsStore.statisticsData?.postCount}
                          prefix={<FileTextOutlined style={{fontSize: '24px'}}/>}
                      />
                    </div>
                  </Skeleton>
                </Card>
              </Col>
          }
          {(currentUser?.role === UserRole.SUPER_ADMIN || currentUser?.role === UserRole.TEACHER) && <Col span={8}>
            <Card title="Всего курсов" extra={
              <Tooltip title="Перейти к курсам">
                <UnorderedListOutlined onClick={() => router.push('/control-panel/courses')}/>
              </Tooltip>
            }>
              <Skeleton active paragraph={{rows: 1}} loading={statisticsStore.loadingStatisticsData}>
                <div className="flex justify-between items-center">
                  <Statistic
                      value={statisticsStore.statisticsData?.courseCount}
                      prefix={<BookOutlined style={{fontSize: '24px'}}/>}
                  />
                </div>
              </Skeleton>
            </Card>
          </Col>}
        </Row>

        {
            (currentUser?.role === UserRole.SUPER_ADMIN || currentUser?.role === UserRole.TEACHER) && <Divider/>
        }
        <Row gutter={16}>
          {currentUser?.role !== UserRole.MODERATOR && <Col span={12}>
            <Card title="Статистика курсов">
              <div className="flex justify-between">
                <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                  <Progress
                      type="circle"
                      percent={statisticsStore.statisticsData?.courseCountNew}
                      format={(percent) => (
                          <p className="text-black text-sm leading-5">
                            <span>{`${percent}%`}</span>
                            <br/>
                            <span>новых</span>
                          </p>
                      )}
                  />
                </Skeleton>
                <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                  <Progress
                      type="circle"
                      strokeColor="green"
                      percent={statisticsStore.statisticsData?.courseCountPublish}
                      format={(percent) => (
                          <p className="text-black text-sm leading-5">
                            <span>{`${percent}%`}</span>
                            <br/>
                            <span>опубликовано</span>
                          </p>
                      )}
                  />
                </Skeleton>
                <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                  <Progress
                      type="circle"
                      strokeColor="orange"
                      percent={statisticsStore.statisticsData?.courseCountIsProcessing}
                      format={(percent) => (
                          <p className="text-black text-sm leading-5">
                            <span>{`${percent}%`}</span>
                            <br/>
                            <span>в обработке</span>
                          </p>
                      )}
                  />
                </Skeleton>
                <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                  <Progress
                      type="circle"
                      strokeColor="red"
                      percent={statisticsStore.statisticsData?.courseCountReject}
                      format={(percent) => (
                          <p className="text-black text-sm leading-5">
                            <span>{`${percent}%`}</span>
                            <br/>
                            <span>отклонено</span>
                          </p>
                      )}
                  />
                </Skeleton>
              </div>
            </Card>
          </Col>}

          {currentUser?.role !== UserRole.MODERATOR && <Col span={12}>
            <Card title="Статистика постов">
              <div className="flex justify-between">
                <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                  <Progress
                      type="circle"
                      percent={statisticsStore.statisticsData?.postsCountNew}
                      format={(percent) => (
                          <p className="text-black text-sm leading-5">
                            <span>{`${percent}%`}</span>
                            <br/>
                            <span>новых</span>
                          </p>
                      )}
                  />
                </Skeleton>
                <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                  <Progress
                      type="circle"
                      strokeColor="green"
                      percent={statisticsStore.statisticsData?.postsCountPublish}
                      format={(percent) => (
                          <p className="text-black text-sm leading-5">
                            <span>{`${percent}%`}</span>
                            <br/>
                            <span>опубликовано</span>
                          </p>
                      )}
                  />
                </Skeleton>
                <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                  <Progress
                      type="circle"
                      strokeColor="orange"
                      percent={statisticsStore.statisticsData?.postsCountIsProcessing}
                      format={(percent) => (
                          <p className="text-black text-sm leading-5">
                            <span>{`${percent}%`}</span>
                            <br/>
                            <span>в обработке</span>
                          </p>
                      )}
                  />
                </Skeleton>
                <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                  <Progress
                      type="circle"
                      strokeColor="red"
                      percent={statisticsStore.statisticsData?.postsCountReject}
                      format={(percent) => (
                          <p className="text-black text-sm leading-5">
                            <span>{`${percent}%`}</span>
                            <br/>
                            <span>отклонено</span>
                          </p>
                      )}
                  />
                </Skeleton>
              </div>
            </Card>
          </Col>}

          {currentUser?.role === UserRole.MODERATOR && (
              <Col span={12}>
                <Card title="Статистика курсов">
                  <div className="flex justify-between space-x-4">
                    <div className="flex flex-col items-center">
                      <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                        <div className="bg-blue-100 p-3 rounded-full">
                          <ClockCircleOutlined className="text-blue-500 text-2xl"/>
                        </div>
                        <p className="text-lg font-semibold mt-2">
                          {statisticsStore.statisticsData?.postsCountNew || 0}
                        </p>
                        <p className="text-sm text-gray-500">Ожидают проверки</p>
                      </Skeleton>
                    </div>
                    <div className="flex flex-col items-center">
                      <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                        <div className="bg-green-100 p-3 rounded-full">
                          <CheckCircleOutlined className="text-green-500 text-2xl"/>
                        </div>
                        <p className="text-lg font-semibold mt-2">
                          {statisticsStore.statisticsData?.postsCountPublish || 0}
                        </p>
                        <p className="text-sm text-gray-500">Подтвержденно</p>
                      </Skeleton>
                    </div>
                    <div className="flex flex-col items-center">
                      <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                        <div className="bg-red-100 p-3 rounded-full">
                          <CloseCircleOutlined className="text-red-500 text-2xl"/>
                        </div>
                        <p className="text-lg font-semibold mt-2">
                          {statisticsStore.statisticsData?.postsCountReject || 0}
                        </p>
                        <p className="text-sm text-gray-500">Отклонено</p>
                      </Skeleton>
                    </div>
                  </div>
                </Card>

                <div className="mt-3">
                  <Card title="Статистика постов">
                    <div className="flex justify-between space-x-4">
                      <div className="flex flex-col items-center">
                        <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                          <div className="bg-blue-100 p-3 rounded-full">
                            <ClockCircleOutlined className="text-blue-500 text-2xl"/>
                          </div>
                          <p className="text-lg font-semibold mt-2">
                            {statisticsStore.statisticsData?.postsCountNew || 0}
                          </p>
                          <p className="text-sm text-gray-500">Ожидают проверки</p>
                        </Skeleton>
                      </div>
                      <div className="flex flex-col items-center">
                        <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                          <div className="bg-green-100 p-3 rounded-full">
                            <CheckCircleOutlined className="text-green-500 text-2xl"/>
                          </div>
                          <p className="text-lg font-semibold mt-2">
                            {statisticsStore.statisticsData?.postsCountPublish || 0}
                          </p>
                          <p className="text-sm text-gray-500">Подтвержденно</p>
                        </Skeleton>
                      </div>
                      <div className="flex flex-col items-center">
                        <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                          <div className="bg-red-100 p-3 rounded-full">
                            <CloseCircleOutlined className="text-red-500 text-2xl"/>
                          </div>
                          <p className="text-lg font-semibold mt-2">
                            {statisticsStore.statisticsData?.postsCountReject || 0}
                          </p>
                          <p className="text-sm text-gray-500">Отклонено</p>
                        </Skeleton>
                      </div>
                    </div>
                  </Card>
                </div>
              </Col>
          )}
        </Row>

      </PageContainerControlPanel>
  );
};

export default observer(ControlPanel);
