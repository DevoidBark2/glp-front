import React, {useEffect, useState} from "react";
import {Button, Card, Divider, Result, Skeleton} from "antd";
import {observer} from "mobx-react";
import {useParams, useSearchParams} from "next/navigation";
import dayjs from "dayjs";

import {ComponentTask} from "@/shared/api/course/model";
import {useMobxStores} from "@/shared/store/RootStore";
import {QuizMultiComponent} from "@/entities/course/ui";
import {FileAttachment, LinksAttachment} from "@/widgets/Lesson";
import ExamCourse from "@/entities/exams/ui/ExamCourse";
import {CourseComponentType} from "@/shared/api/component/model";

import {TextComponent} from "../TextComponent";
import {QuizComponent} from "../QuizComponent";
import {SimpleTask} from "../SimpleTask";
import {isExamCoursePage} from "../../selectors";


export const CourseSectionCard = observer(() => {
    const { courseStore, commentsStore } = useMobxStores();
    const searchParams = useSearchParams();
    const { courseId } = useParams();
    const stepParam = searchParams.get("step");
    const step = !isNaN(Number(stepParam)) && Number(stepParam) !== 0 ? Number(stepParam) : null;

    const [showStats, setShowStats] = useState(false); // Состояние для контроля видимости статистики

    const toggleStats = () => {
        setShowStats(!showStats); // Переключение видимости
    };

    const handleCheckResult = async (quiz: ComponentTask, userAnswer: string | number[]) => await courseStore.handleCheckTask({
            task: quiz,
            answers: userAnswer,
            currentSection: step!,

        }, Number(courseId));

    const startExam = () => {
        courseStore.startExam(Number(courseId))
    }

    useEffect(() => {
        if (step !== null) {
            courseStore.getCourseSectionByStepId(Number(courseId), step).then(() => {
                if (step !== -1) {
                    commentsStore.getSectionComments(step);
                }
            }).catch((e) => {
                console.error("Ошибка при загрузке данных:", e);
            });
        }

        return () => {
            courseStore.setMessageWarning(null);
            courseStore.setEndExamUser(null);
        };
    }, [searchParams, courseId, courseStore, commentsStore]);

    return (
        <>
            {courseStore.endExamUser && (
                <>
                    <div className={`p-4 rounded-2xl shadow-lg text-xl text-center text-white mb-2 ${courseStore.endExamUser.success ? 'bg-green-400' : 'bg-red-400'}`}>
                        {courseStore.endExamUser.message}
                    </div>

                    {/*<button*/}
                    {/*    className="text-gray-500 mb-2"*/}
                    {/*    onClick={toggleStats}*/}
                    {/*>*/}
                    {/*    {showStats ? 'Скрыть статистику' : 'Узнать подробнее'}*/}
                    {/*</button>*/}

                    {/*{showStats && <p className="text-center text-lg font-bold">Результат экзамена</p>}*/}
                    {/*{showStats && <Divider/>}*/}
                    {/*{showStats && courseStore.examCourse?.components.map((component) => {*/}
                    {/*    debugger*/}
                    {/*    const { componentTask } = component;*/}
                    {/*    const totalQuestions = componentTask.questions?.length;*/}
                    {/*    const correctAnswers = componentTask.userAnswer?.answer.filter(ans => ans.isCorrect).length;*/}
                    {/*    const isSuccess = correctAnswers === totalQuestions;*/}

                    {/*    return (*/}
                    {/*        <div key={component.id} className="mb-2 p-2 rounded-lg">*/}
                    {/*            <h3 className="text-xl font-semibold">{componentTask.title}</h3>*/}
                    {/*            <p className={`font-medium ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>*/}
                    {/*                {correctAnswers} из {totalQuestions} правильных*/}
                    {/*            </p>*/}
                    {/*        </div>*/}
                    {/*    );*/}
                    {/*})}*/}

                    {showStats && courseStore.examCourse && (
                        <div className="mt-6 mb-3 text-center p-4 rounded-lg shadow-lg bg-blue-100">
                            <p className="text-lg font-semibold">Итоговый результат</p>
                            <p className="text-xl">
                                {courseStore.examCourse?.components?.reduce((total, component) => {
                                    const correctAnswersInComponent = component.componentTask?.userAnswer?.answer.filter(ans => ans.isCorrect).length;
                                    return total + Number(correctAnswersInComponent);
                                }, 0)} из {" "}
                                {courseStore.examCourse?.components?.reduce((total, component) => total + (component.componentTask?.type === CourseComponentType.SimpleTask ? 1 : component.componentTask?.questions?.length || 0), 0)} правильных
                            </p>
                            <p className="mt-2 text-lg font-bold">
                                Итоговый результат: {courseStore.examCourse.exam.progress}% правильных
                            </p>
                        </div>
                    )}
                </>
            )}


            {!courseStore.messageWarning ? <Card
                loading={courseStore.loadingSection}
                variant="borderless"
                title={
                    <div className="flex items-center justify-between gap-2 flex-wrap space-y-2 my-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white break-all">
                                {courseStore.loadingSection ? (
                                    <Skeleton.Input />
                                ) : (
                                    courseStore.sectionCourse?.name || `Экзамен - ${courseStore.examCourse?.title || ""}`
                                )}
                            </h2>
                            <p className="text-sm text-gray-500">{courseStore.sectionCourse?.small_description}</p>
                        </div>
                        {courseStore.examCourse &&
                            <div>
                                <p className="dark:text-gray-400 text-sm flex gap-2 justify-between">
                                    <span className="text-gray-500">Начало экзамена:</span>
                                    <span className="font-medium">{dayjs(courseStore.examCourse?.exam.startExamAt).format("DD.MM.YYYY HH:mm")}</span>
                                </p>
                                <p className="dark:text-gray-400 text-sm flex gap-2 justify-between">
                                    <span className="text-gray-500">Конец экзамена:</span>
                                    <span className="font-medium">{dayjs(courseStore.examCourse?.exam.endExamAt).format("DD.MM.YYYY HH:mm")}</span>
                                </p>
                            </div>

                        }
                    </div>
                }
                className="dark:bg-[#1a1a1a] shadow-lg"
            >
                {!isExamCoursePage(searchParams) &&
                    courseStore.sectionCourse?.components?.map((component) => {
                        const { componentTask } = component;

                        switch (componentTask.type) {
                            case CourseComponentType.Text:
                                return <TextComponent key={component.id} component={componentTask} />;

                            case CourseComponentType.Quiz:
                                return <QuizComponent
                                    key={component.id}
                                    task={componentTask}
                                    onCheckResult={handleCheckResult}
                                />

                            case CourseComponentType.SimpleTask:
                                return <SimpleTask
                                    key={component.id}
                                    task={componentTask}
                                    onCheckResult={handleCheckResult}
                                />;

                            case CourseComponentType.MultiPlayChoice:
                                return <QuizMultiComponent
                                    key={component.id}
                                    task={componentTask}
                                    onCheckResult={handleCheckResult}
                                />;

                            default:
                                return null;
                        }
                    })}

                {isExamCoursePage(searchParams) && <ExamCourse exam={courseStore.examCourse!} />}

                {courseStore.messageWarning && <h1>{courseStore.messageWarning}</h1>}

                {(courseStore.sectionCourse?.files && courseStore.sectionCourse?.files.length > 0 || courseStore.sectionCourse?.links && courseStore.sectionCourse?.links.length > 0) &&
                    <Divider />}
                <div className="space-y-12">
                    <FileAttachment />
                    <LinksAttachment />
                </div>
                <div className="space-y-12">
                    <FileAttachment />
                    <LinksAttachment />
                </div>
            </Card> : <Result
                status={courseStore.messageWarning.success ? "success" : "error"}
                title={courseStore.messageWarning.message}
                extra={
                    courseStore.messageWarning.success && <Button variant="solid" color="default" onClick={startExam}>
                        Начать
                    </Button>
                }
            />}
        </>
    );
});
