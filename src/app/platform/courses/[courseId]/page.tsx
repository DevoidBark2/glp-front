"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Menu, Layout, Card, Progress, Button, Input, Dropdown, Popover, Divider } from "antd";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftOutlined, ArrowRightOutlined, DownOutlined } from "@ant-design/icons";
import { useMobxStores } from "@/stores/stores";
import { Header } from "antd/es/layout/layout";
import { CourseComponentTypeI } from "@/stores/CourseComponent";
import { CourseComponentType } from "@/shared/api/course/model";

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

type Question = {
    question: string;
    options: string[];
    correctOptions: number[];
};

type QuizProps = {
    quiz: CourseComponentTypeI
};

const QuizMultiComponent: React.FC<QuizProps> = ({ quiz }) => {
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]); // Храним выбранные ответы
    const [showResults, setShowResults] = useState<boolean>(false);

    const handleOptionChange = (index: number) => {
        setSelectedAnswers((prevAnswers) => {
            if (prevAnswers.includes(index)) {
                return prevAnswers.filter((answer) => answer !== index);
            }
            return [...prevAnswers, index];
        });
    };

    const checkAnswers = () => {
        setShowResults(true);
    };

    return (
        <div className="quiz-component bg-white p-6 rounded-lg shadow-md">
            {quiz.title && <h2 className="text-2xl font-bold mb-4 text-gray-800">{quiz.title}</h2>}
            {quiz.description && <p className="text-gray-600 mb-4">{quiz.description}</p>}

            {quiz.questions.map((questionItem, questionIndex) => (
                <div key={questionIndex} className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">{questionItem.question}</h3>

                    <div className="options">
                        {questionItem.options.map((option, optionIndex) => (
                            <label
                                key={optionIndex}
                                className={`block cursor-pointer mb-2 p-4 border rounded-lg transition-all ${selectedAnswers.includes(optionIndex)
                                    ? 'bg-blue-100 border-blue-500'
                                    : 'bg-white border-gray-300'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    value={optionIndex}
                                    checked={selectedAnswers.includes(optionIndex)}
                                    onChange={() => handleOptionChange(optionIndex)}
                                    className="mr-2"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            <button
                onClick={checkAnswers}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-all"
            >
                Check Answers
            </button>

            {showResults && (
                <div className="mt-6">
                    {quiz.questions.map((questionItem, questionIndex) => (
                        <div key={questionIndex} className="mb-4">
                            <h4 className="text-lg font-medium text-gray-800">{questionItem.question}</h4>
                            {questionItem.options.map((option, optionIndex) => {
                                const isCorrect = questionItem.correctOptions.includes(optionIndex);
                                const isSelected = selectedAnswers.includes(optionIndex);
                                const className = isCorrect
                                    ? 'text-green-600'
                                    : isSelected && !isCorrect
                                        ? 'text-red-600'
                                        : 'text-gray-800';

                                return (
                                    <p key={optionIndex} className={`mt-2 ${className}`}>
                                        {option} {isCorrect && '(Correct)'}
                                        {isSelected && !isCorrect && '(Your answer)'}
                                    </p>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const CoursePage = () => {
    const { courseId } = useParams();
    const { courseStore } = useMobxStores();
    const [selectedSection, setSelectedSection] = useState(0);
    const [progress, setProgress] = useState(0);

    const handleMenuClick = ({ key }) => {
        setSelectedSection(key);
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

    const courseDetailsContent = (
        <div>
            <p>Всего заданий: 100</p>
            <p>Сложных заданий: 2</p>
            <p>Легких заданий: 4</p>
            <p>Оценочное время: не указано</p>
            {/* Добавьте другие детали по необходимости */}
        </div>
    );

    useEffect(() => {
        courseStore.getFullCourseById(Number(courseId)).then((response) => {
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
                <Popover content={courseDetailsContent} placement="topLeft" title="Информация о курсе" trigger="hover">
                    <h1 className="text-xl font-semibold text-gray-800 cursor-pointer">
                        {courseStore.fullDetailCourse?.name || 'Название курса'}
                    </h1>
                </Popover>


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
                                <>
                                    <h2 className="text-2xl font-semibold text-gray-800 mt-4">
                                        {courseStore.fullDetailCourse?.sections.find(
                                            (s) => s.id === Number(selectedSection)
                                        )?.name || 'Section Name'}
                                    </h2>
                                    <Divider />
                                </>
                            }
                            style={{
                                flex: 1,
                                marginBottom: 24,
                                borderRadius: '12px',
                            }}
                            bodyStyle={{
                                paddingLeft: '24px',
                                paddingRight: '24px',
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
                                    if (component.type === CourseComponentType.MultiPlayChoice) {
                                        return <QuizMultiComponent key={component.id} quiz={component} />;
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

                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default observer(CoursePage);