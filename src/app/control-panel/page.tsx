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
  Progress, Skeleton
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
    const interval = setInterval(() => {
      setCurrentDate(dayjs().locale('ru').format('DD MMMM YYYY, HH:mm:ss'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentUser = getCookieUserDetails();
    setCurrentUser(currentUser);

    statisticsStore.getAllStatisticsData();
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

    </div>
  );
};

export default observer(ControlPanel);
