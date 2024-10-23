"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Menu, Layout, Card, Progress, Button, Tooltip, Modal, Input, List, Checkbox, Dropdown } from "antd";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftOutlined, ArrowRightOutlined, BookOutlined, CheckOutlined, DownOutlined, MessageOutlined } from "@ant-design/icons";
import { useMobxStores } from "@/stores/stores";
import { CourseComponentType } from "@/enums/CourseComponentType";
import { Header } from "antd/es/layout/layout";

const { Sider, Content } = Layout;
const { TextArea } = Input;

const QuizComponent = ({ quiz }) => {
    const { title, questions } = quiz;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(null)); // Для хранения ответов

    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionChange = (index) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = index; // Сохраняем ответ для текущего вопроса
        setSelectedAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleResetCurrent = () => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = null; // Сбрасываем ответ для текущего вопроса
        setSelectedAnswers(newAnswers);
    };

    const handleResetAll = () => {
        setSelectedAnswers(Array(questions.length).fill(null)); // Сбрасываем все ответы
    };

    return (
        <div className="quiz-container bg-white rounded-lg shadow-md p-6 mb-6 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-4 text-center">{title}</h3>
            <div className="question mb-4">
                <h4 className="text-lg font-semibold mb-2">
                    {`Вопрос ${currentQuestionIndex + 1}: ${currentQuestion.question}`}
                </h4>
                <div className="options space-y-3">
                    {currentQuestion.options.map((option, index) => (
                        <div
                            key={index}
                            className={`border rounded-lg p-4 cursor-pointer transition duration-200 
                                        ${selectedAnswers[currentQuestionIndex] === index ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-300'}`}
                            onClick={() => handleOptionChange(index)}
                        >
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name={`question-${currentQuestionIndex}`}
                                    value={index}
                                    checked={selectedAnswers[currentQuestionIndex] === index}
                                    onChange={() => handleOptionChange(index)}
                                    className="mr-2"
                                />
                                {option}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="navigation flex justify-between mt-4">
                <button
                    onClick={handleBack}
                    className={`btn ${currentQuestionIndex === 0 ? 'hidden' : 'block'} bg-gray-300 hover:bg-gray-400 text-black rounded px-4 py-2`}
                >
                    Назад
                </button>
                <button
                    onClick={handleNext}
                    className={`btn ${currentQuestionIndex === questions.length - 1 ? 'hidden' : 'block'} bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2`}
                >
                    Далее
                </button>
                {currentQuestionIndex === questions.length - 1 && (
                    <button
                        onClick={() => {
                            // Логика завершения квиза (можно, например, показать результаты)
                            alert('Квиз завершён! Ваши ответы: ' + selectedAnswers.join(', '));
                        }}
                        className="btn bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2"
                    >
                        Завершить
                    </button>
                )}
            </div>
            <div className="reset-buttons flex justify-between mt-4">
                <button
                    onClick={handleResetCurrent}
                    className="btn bg-yellow-400 hover:bg-yellow-500 text-black rounded px-4 py-2"
                >
                    Сбросить ответ на текущий вопрос
                </button>
                <button
                    onClick={handleResetAll}
                    className="btn bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2"
                >
                    Сбросить все ответы
                </button>
            </div>
        </div>
    );
};

const CoursePage = () => {
    const { courseId } = useParams();
    const { courseStore } = useMobxStores();
    const [selectedSection, setSelectedSection] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isQuizVisible, setQuizVisible] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [completedSections, setCompletedSections] = useState([]);
    const [bookmarkedSections, setBookmarkedSections] = useState([]);

    // Тестовые данные для курса
    const sections = [
        { key: "1", title: "Введение", content: "Добро пожаловать в курс! Здесь вы узнаете основы." },
        { key: "2", title: "Тема 1: Основы", content: "В этой теме вы изучите основы программирования." },
        { key: "3", title: "Тема 2: Продвинутые концепции", content: "Здесь мы рассмотрим более сложные концепции." },
        { key: "4", title: "Заключение", content: "Поздравляем, вы прошли курс!" },
    ];

    const handleMenuClick = ({ key }) => {
        debugger
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
    const router = useRouter()

    // Определяем меню для выпадающего списка
    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={() => router.back()}>
                Выйти из курса
            </Menu.Item>
        </Menu>
    );

    const handleQuiz = () => {
        setQuizVisible(true);
    };

    useEffect(() => {
        courseStore.getFullCourseById(Number(courseId)).then((response) => {
            debugger
            setSelectedSection(response.sections[0].id)
        });
    }, [courseId])

    return (
        <Layout>
            {/* Шапка (Header) */}
            <Header
                className="fixed w-full top-0 left-0 z-50"
                style={{
                    padding: '0 24px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '64px',
                }}
            >
                <h1 className="text-xl font-semibold text-gray-800">
                    {courseStore.fullDetailCourse?.name}
                </h1>

                {/* Прогресс по курсу */}
                <div style={{ flex: 1, margin: '0 16px' }}>
                    <Progress
                        percent={progress}
                        status="active"
                        strokeColor={{
                            from: '#108ee9',
                            to: '#87d068',
                        }}
                        showInfo={true}
                    />
                </div>

                <Dropdown overlay={menu} trigger={['hover']}>
                    <Button type="primary">
                        Кнопка действия <DownOutlined />
                    </Button>
                </Dropdown>
            </Header>

            {/* Layout для контента и меню */}
            <Layout style={{ marginTop: 64 }}>
                {/* Фиксированное боковое меню */}
                <Sider
                    width={300}
                    className="site-layout-background fixed left-0 top-16 bottom-0"
                    style={{
                        overflowY: 'auto',
                        height: 'calc(100vh - 64px)', // Учитываем высоту header
                        position: 'fixed',
                    }}
                >
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedSection.toString()]} // Используем selectedKeys для динамического выделения
                        onClick={handleMenuClick}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        {courseStore.fullDetailCourse?.sections.map((section) => (
                            <Menu.Item
                                key={section.id}
                            >
                                {section.name}
                            </Menu.Item>
                        ))}
                    </Menu>
                </Sider>

                {/* Основной контент */}
                <Layout style={{ marginLeft: 300, padding: '24px', }}>
                    <Content
                        style={{
                            padding: '24px',
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {/* Карточка контента */}
                        <Card
                            title={
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    {courseStore.fullDetailCourse?.sections.find(
                                        (s) => s.id === Number(selectedSection)
                                    )?.name || 'Section Name'}
                                </h2>
                            }
                            extra={
                                <Tooltip title="Добавить в закладки">
                                    <Button icon={<BookOutlined />} onClick={handleBookmark} />
                                </Tooltip>
                            }
                            style={{
                                flex: 1,
                                marginBottom: 24,
                                borderRadius: '12px',
                            }}
                            bodyStyle={{
                                padding: '24px',
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                            }}
                        >
                            {courseStore.fullDetailCourse?.sections
                                .find((s) => s.id === Number(selectedSection))
                                ?.components.map((component) => {
                                    if (component.type === CourseComponentType.Text) {
                                        return (
                                            <div key={component.id} className="mb-6">
                                                {component.title && (
                                                    <h3 className="text-xl font-medium text-gray-700 mb-4">
                                                        {component.title}
                                                    </h3>
                                                )}
                                                <div
                                                    className="prose prose-lg text-gray-600 leading-relaxed"
                                                    dangerouslySetInnerHTML={{
                                                        __html: component.content_description || '',
                                                    }}
                                                />
                                            </div>
                                        );
                                    }
                                    if (component.type === CourseComponentType.Quiz) {
                                        return <QuizComponent key={component.id} quiz={component} />;
                                    }
                                })}
                        </Card>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                            {/* Кнопка Назад */}
                            {selectedSection > 0 && (
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        const currentSectionId = selectedSection; // ID текущего раздела
                                        const allSections = courseStore.fullDetailCourse?.sections; // Все разделы

                                        if (!allSections || allSections.length === 0) {
                                            return; // Если разделов нет, просто выходим
                                        }

                                        // Находим индекс текущего раздела
                                        const currentIndex = allSections.findIndex(section => section.id === currentSectionId);

                                        // Проверяем, есть ли предыдущий раздел
                                        const prevIndex = currentIndex - 1;

                                        if (prevIndex >= 0) {
                                            // Если есть предыдущий раздел, обновляем состояние с новым ID
                                            const prevSectionId = allSections[prevIndex].id;
                                            setSelectedSection(prevSectionId);
                                        }
                                    }}
                                    style={{
                                        backgroundColor: '#1890ff',
                                        borderColor: '#1890ff',
                                        borderRadius: '8px',
                                        padding: '8px 16px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        transition: 'all 0.3s ease',
                                    }}
                                    icon={<ArrowLeftOutlined />}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#40a9ff'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1890ff'}
                                >
                                    Назад
                                </Button>
                            )}

                            <Button
                                type="primary"
                                onClick={() => {
                                    const currentSectionId = selectedSection; // ID текущего раздела
                                    const allSections = courseStore.fullDetailCourse?.sections; // Все разделы

                                    if (!allSections || allSections.length === 0) {
                                        return; // Если разделов нет, просто выходим
                                    }

                                    // Находим индекс текущего раздела
                                    const currentIndex = allSections.findIndex(section => section.id === currentSectionId);

                                    // Проверяем, есть ли следующий раздел
                                    const nextIndex = currentIndex + 1;

                                    if (nextIndex < allSections.length) {
                                        // Если есть следующий раздел, обновляем состояние с новым ID
                                        const nextSectionId = allSections[nextIndex].id;
                                        setSelectedSection(nextSectionId);
                                    }
                                }}
                                style={{
                                    backgroundColor: '#1890ff',
                                    borderColor: '#1890ff',
                                    borderRadius: '8px',
                                    padding: '8px 16px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s ease',
                                }}
                                icon={<ArrowRightOutlined />}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#40a9ff'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1890ff'}
                            >
                                Следующий раздел
                            </Button>
                        </div>


                        {/* Блок комментариев */}
                        <Card
                            title="Комментарии"
                            style={{
                                flex: 1,
                                marginBottom: 24,
                                borderRadius: '12px',
                            }}
                            bodyStyle={{
                                padding: '24px',
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                            }}
                        >
                            <List
                                dataSource={comments}
                                renderItem={(comment) => (
                                    <List.Item className="mb-2">
                                        <MessageOutlined style={{ marginRight: 8 }} />
                                        <span className="text-gray-700">{comment}</span>
                                    </List.Item>
                                )}
                                style={{
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    marginBottom: '16px',
                                    paddingRight: '10px',
                                }}
                            />
                            <TextArea
                                rows={4}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Оставьте комментарий..."
                                style={{ marginBottom: '8px', borderRadius: '8px' }}
                            />
                            <Button type="primary" onClick={handleAddComment}>
                                Добавить комментарий
                            </Button>
                        </Card>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default observer(CoursePage);



{/* <Sider width={300} style={{ background: '#f0f2f5', padding: '24px', overflowY: 'auto' }}>
                    <h3>Прогресс по курсу</h3>
                    <Progress percent={progress} status="active" />
                    <h3>Закладки</h3>
                    <Menu
                        mode="inline"
                        style={{ borderRight: 0, overflowY: 'auto' }}
                    >
                        {sections.map(section => (
                            bookmarkedSections.includes(section.key) && (
                                <Menu.Item key={section.key} onClick={() => setSelectedSection(section.key)}>
                                    {section.title}
                                </Menu.Item>
                            )
                        ))}
                    </Menu>
                </Sider> */}