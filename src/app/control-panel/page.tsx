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
  BookOutlined,UnorderedListOutlined,
} from "@ant-design/icons";
import { useMobxStores } from "@/stores/stores";
import { useRouter } from "next/navigation";
import { getCookieUserDetails } from "@/lib/users";
import { UserRole } from "@/enums/UserRoleEnum";
import PageContainerControlPanel from "@/components/PageContainerControlPanel/PageContainerControlPanel";
import { WelcomeTextComponent } from "@/features/control-panel";

const ControlPanel = () => {
  const { statisticsStore } = useMobxStores();
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    const currentUser = getCookieUserDetails();
    setCurrentUser(currentUser);

    statisticsStore.getAllStatisticsData();
  }, [])


  return (
    <PageContainerControlPanel>
      <div className="flex items-center justify-start">
        <WelcomeTextComponent/>
      </div>
      <Divider />
      <Typography.Title className="text-gray-800">
        {currentUser?.user.role === UserRole.MODERATOR ? "Панель модератора" : currentUser?.user.role === UserRole.TEACHER ? "Панель Учителя" : "Админ-панель"}
      </Typography.Title>

      <Row gutter={16}>
        {
          currentUser?.user.role === UserRole.SUPER_ADMIN && <Col span={8}>
            <Card title="Активные пользователи" extra={
              <Tooltip title="Перейти к пользователям">
                <UnorderedListOutlined onClick={() => router.push('/control-panel/users')} />
              </Tooltip>
            }>
              <Skeleton active paragraph={{ rows: 1 }} loading={statisticsStore.loadingStatisticsData}>
                <Statistic
                  value={statisticsStore.statisticsData?.countUsers}
                  prefix={<UserOutlined />}
                />
              </Skeleton>
            </Card>
          </Col>
        }
        {
          (currentUser?.user.role === UserRole.SUPER_ADMIN || currentUser?.user.role === UserRole.TEACHER) && <Col span={8}>
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
        }
        {(currentUser?.user.role === UserRole.SUPER_ADMIN || currentUser?.user.role === UserRole.TEACHER) && <Col span={8}>
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
        </Col>}
      </Row>

      {
        (currentUser?.user.role === UserRole.SUPER_ADMIN || currentUser?.user.role === UserRole.TEACHER) && <Divider />
      }
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Статистика курсов">
            <div className="flex justify-between">
              <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                <Progress
                  type="circle"
                  strokeColor="blue"
                  percent={statisticsStore.statisticsData?.coursesCompleted}
                  format={(percent) => <p className="text-sm leading-5">{`${percent}% курсов завершено`}</p>}
                />
              </Skeleton>
              <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                <Progress
                  type="circle"
                  percent={statisticsStore.statisticsData?.coursesInProgress}
                  format={(percent) => <p className="text-sm leading-5">{`${percent}% курсов в процессе`}</p>}
                />
              </Skeleton>
              <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                <Progress
                  type="circle"
                  strokeColor="green"
                  percent={statisticsStore.statisticsData?.studentsEnrolled}
                  format={(percent) => <p className="text-sm leading-5">{`${percent}% студентов записано`}</p>}
                />
              </Skeleton>
              <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                <Progress
                  type="circle"
                  strokeColor="red"
                  percent={statisticsStore.statisticsData?.coursesDropped}
                  format={(percent) => <p className="text-sm leading-5">{`${percent}% курсов отменено`}</p>}
                />
              </Skeleton>
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Статистика постов">
            <div className="flex justify-between">
              <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                <Progress
                  type="circle"
                  percent={statisticsStore.statisticsData?.postsCountNew}
                  format={(percent) => (
                    <p className="text-sm leading-5">
                      <span className="whitespace-nowrap">{`${percent}%`}</span>
                      <br />
                      новых
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
                    <p className="text-sm leading-5">
                      <span className="whitespace-nowrap">{`${percent}%`}</span>
                      <br />
                      опубликовано
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
                    <p className="text-sm leading-5">
                      <span className="whitespace-nowrap">{`${percent}%`}</span>
                      <br />
                      в обработке
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
                    <p className="text-sm leading-5">
                      <span className="whitespace-nowrap">{`${percent}%`}</span>
                      <br />
                      отклонено
                    </p>
                  )}
                />
              </Skeleton>
            </div>
          </Card>
        </Col>

        {/* <Col span={12}>
          <Card title="Статистика постов (Модератор)">
            <div className="flex justify-between">
              <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                <Progress
                  type="circle"
                  strokeColor="purple"
                  percent={statisticsStore.statisticsData?.postsReviewed}
                  format={(percent) => <p className="text-sm leading-5">{`${percent}% постов проверено`}</p>}
                />
              </Skeleton>
              <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                <Progress
                  type="circle"
                  percent={statisticsStore.statisticsData?.commentsModerated}
                  format={(percent) => <p className="text-sm leading-5">{`${percent}% комментариев модерировано`}</p>}
                />
              </Skeleton>
              <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                <Progress
                  type="circle"
                  strokeColor="orange"
                  percent={statisticsStore.statisticsData?.reportsResolved}
                  format={(percent) => <p className="text-sm leading-5">{`${percent}% жалоб решено`}</p>}
                />
              </Skeleton>
              <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                <Progress
                  type="circle"
                  strokeColor="red"
                  percent={statisticsStore.statisticsData?.postsRejected}
                  format={(percent) => <p className="text-sm leading-5">{`${percent}% постов отклонено`}</p>}
                />
              </Skeleton>
            </div>
          </Card>
        </Col> */}



        <Col span={12}>
          <Card title="Статистика компонентов курсов">
            <div className="flex justify-between">
              <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                <Progress
                  type="circle"
                  strokeColor="purple"
                  percent={statisticsStore.statisticsData?.componentsCompleted}
                  format={(percent) => <p className="text-sm leading-5">{`${percent}% компонентов завершено`}</p>}
                />
              </Skeleton>
              <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                <Progress
                  type="circle"
                  percent={statisticsStore.statisticsData?.componentsPending}
                  format={(percent) => <p className="text-sm leading-5">{`${percent}% компонентов в ожидании`}</p>}
                />
              </Skeleton>
              <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                <Progress
                  type="circle"
                  strokeColor="orange"
                  percent={statisticsStore.statisticsData?.componentsInProgress}
                  format={(percent) => <p className="text-sm leading-5">{`${percent}% компонентов в процессе`}</p>}
                />
              </Skeleton>
              <Skeleton active loading={statisticsStore.loadingStatisticsData}>
                <Progress
                  type="circle"
                  strokeColor="red"
                  percent={statisticsStore.statisticsData?.componentsFailed}
                  format={(percent) => <p className="text-sm leading-5">{`${percent}% компонентов не выполнено`}</p>}
                />
              </Skeleton>
            </div>
          </Card>
        </Col>
      </Row>

    </PageContainerControlPanel>
  );
};

export default observer(ControlPanel);
