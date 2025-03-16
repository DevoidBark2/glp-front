import { Button, Card, Divider, Result, Skeleton } from "antd";
import { observer } from "mobx-react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import dayjs from "dayjs";

import { ComponentTask } from "@/shared/api/course/model";
import { useMobxStores } from "@/shared/store/RootStore";
import { QuizMultiComponent } from "@/entities/course/ui";
import { FileAttachment, LinksAttachment } from "@/widgets/Lesson";
import ExamCourse from "@/entities/exams/ui/ExamCourse";
import { CourseComponentType } from "@/shared/api/component/model";

import { TextComponent } from "../TextComponent";
import { QuizComponent } from "../QuizComponent";
import { SimpleTask } from "../SimpleTask";
import { isExamCoursePage } from "../../selectors";



export const CourseSectionCard = observer(() => {
    const { courseStore, commentsStore } = useMobxStores();
    const searchParams = useSearchParams();
    const { courseId } = useParams();
    const stepParam = searchParams.get("step");
    const step = !isNaN(Number(stepParam)) && Number(stepParam) !== 0 ? Number(stepParam) : null;

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
        };
    }, [searchParams, courseId, courseStore, commentsStore]);

    return (
        <>
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
                                    <span className="font-medium">{dayjs(courseStore.examCourse?.startExamAt).format("DD.MM.YYYY HH:mm")}</span>
                                </p>
                                <p className="dark:text-gray-400 text-sm flex gap-2 justify-between">
                                    <span className="text-gray-500">Конец экзамена:</span>
                                    <span className="font-medium">{dayjs(courseStore.examCourse?.endExamAt).format("DD.MM.YYYY HH:mm")}</span>
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
