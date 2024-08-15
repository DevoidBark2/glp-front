"use client";
import React, {useState} from "react";
import {observer} from "mobx-react";
import {Menu, Layout, Card, Progress, Button, Tooltip, Modal, Input, List, Checkbox} from "antd";
import {useParams} from "next/navigation";
import {BookOutlined, CheckOutlined, MessageOutlined} from "@ant-design/icons";

const {Sider, Content} = Layout;
const {TextArea} = Input;

const CoursePage = () => {
    const {courseId} = useParams();
    const [selectedSection, setSelectedSection] = useState("1");
    const [progress, setProgress] = useState(0);
    const [isQuizVisible, setQuizVisible] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [completedSections, setCompletedSections] = useState([]);
    const [bookmarkedSections, setBookmarkedSections] = useState([]);

    // Тестовые данные для курса
    const sections = [
        {key: "1", title: "Введение", content: "Добро пожаловать в курс! Здесь вы узнаете основы."},
        {key: "2", title: "Тема 1: Основы", content: "В этой теме вы изучите основы программирования."},
        {key: "3", title: "Тема 2: Продвинутые концепции", content: "Здесь мы рассмотрим более сложные концепции."},
        {key: "4", title: "Заключение", content: "Поздравляем, вы прошли курс!"},
    ];

    const handleMenuClick = ({key}) => {
        setSelectedSection(key);
    };

    const handleCompleteSection = () => {
        if (!completedSections.includes(selectedSection)) {
            setCompletedSections([...completedSections, selectedSection]);
            setProgress((completedSections.length + 1) / sections.length * 100);
        }
    };

    const handleBookmark = () => {
        if (!bookmarkedSections.includes(selectedSection)) {
            setBookmarkedSections([...bookmarkedSections, selectedSection]);
        }
    };

    const handleAddComment = () => {
        setComments([...comments, newComment]);
        setNewComment("");
    };

    const handleQuiz = () => {
        setQuizVisible(true);
    };

    return (
        <Layout style={{height: '100vh'}}>
            <Sider width={300} className="site-layout-background" style={{overflowY: 'auto'}}>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={[selectedSection]}
                    onClick={handleMenuClick}
                    style={{height: '100%', borderRight: 0}}
                >
                    {sections.map((section) => (
                        <Menu.Item key={section.key} icon={
                            bookmarkedSections.includes(section.key) ? <BookOutlined /> : null
                        }>
                            {section.title}
                        </Menu.Item>
                    ))}
                </Menu>
            </Sider>
            <Layout style={{padding: '24px'}}>
                <Content
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'auto',
                        height: '100%',
                    }}
                >
                    <Card
                        title={sections.find(s => s.key === selectedSection)?.title}
                        extra={
                            <Tooltip title="Добавить в закладки">
                                <Button icon={<BookOutlined />} onClick={handleBookmark} />
                            </Tooltip>
                        }
                        style={{flex: 1, overflowY: 'auto', marginBottom: 24}}
                    >
                        {sections.find(s => s.key === selectedSection)?.content}

                        <div style={{marginTop: 24}}>
                            <Button type="primary" onClick={handleCompleteSection} icon={<CheckOutlined />} style={{marginRight: 16}}>
                                Отметить как пройденное
                            </Button>
                            <Button onClick={handleQuiz}>Пройти тест</Button>
                        </div>

                        <Modal
                            title="Тест по разделу"
                            visible={isQuizVisible}
                            onOk={() => setQuizVisible(false)}
                            onCancel={() => setQuizVisible(false)}
                        >
                            <p>Вопрос 1: Какой цвет у неба?</p>
                            <Checkbox>Синий</Checkbox>
                            <Checkbox>Зеленый</Checkbox>
                            <Checkbox>Красный</Checkbox>
                        </Modal>
                    </Card>

                    <div style={{flex: 1, overflowY: 'auto'}}>
                        <h3>Комментарии</h3>
                        <List
                            dataSource={comments}
                            renderItem={(comment) => (
                                <List.Item>
                                    <MessageOutlined style={{marginRight: 8}} />
                                    {comment}
                                </List.Item>
                            )}
                            style={{maxHeight: '200px', overflowY: 'auto'}}
                        />
                        <TextArea
                            rows={4}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Оставьте комментарий..."
                        />
                        <Button type="primary" onClick={handleAddComment} style={{marginTop: 8}}>Добавить комментарий</Button>
                    </div>
                </Content>

                <Sider width={300} style={{background: '#f0f2f5', padding: '24px', overflowY: 'auto'}}>
                    <h3>Прогресс по курсу</h3>
                    <Progress percent={progress} status="active" />
                    <h3>Закладки</h3>
                    <Menu
                        mode="inline"
                        style={{borderRight: 0, overflowY: 'auto'}}
                    >
                        {sections.map(section => (
                            bookmarkedSections.includes(section.key) && (
                                <Menu.Item key={section.key} onClick={() => setSelectedSection(section.key)}>
                                    {section.title}
                                </Menu.Item>
                            )
                        ))}
                    </Menu>
                </Sider>
            </Layout>
        </Layout>
    );
}

export default observer(CoursePage);
