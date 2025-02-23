import { ComponentTask } from "@/shared/api/course/model";
import { useMobxStores } from "@/shared/store/RootStore";
import { Card, Divider, Skeleton } from "antd";
import { observer } from "mobx-react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { TextComponent } from "../TextComponent";
import { QuizComponent } from "../QuizComponent";
import { QuizMultiComponent } from "@/entities/course/ui";
import { SimpleTask } from "../SimpleTask";
import { FileAttachment, LinksAttachment } from "@/widgets/Lesson";
import ExamCourse from "@/entities/exams/ui/ExamCourse";
import { isExamCoursePage } from "../../selectors";
import { CourseComponentType } from "@/shared/api/component/model";

export const CourseSectionCard = observer(() => {
    const { courseStore, commentsStore } = useMobxStores();
    const searchParams = useSearchParams();
    const { courseId } = useParams();
    const stepParam = searchParams.get("step");
    const step = !isNaN(Number(stepParam)) && Number(stepParam) !== 0 ? Number(stepParam) : null;

    const handleCheckResult = async (quiz: ComponentTask, userAnswer: string | number[]) => {
        await courseStore.handleCheckTask({
            task: quiz,
            answers: userAnswer,
            currentSection: step!,
        });
    };

    const handleRetryResult = async (quiz: ComponentTask, userAnswer: string | number[]) => {
        await courseStore.handleCheckTask({
            task: quiz,
            answers: userAnswer,
            currentSection: step!,
        });
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
        <Card
            loading={courseStore.loadingSection}
            variant="borderless"
            title={
                <div className="space-y-2 my-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {courseStore.loadingSection ? (
                            <Skeleton.Input />
                        ) : (
                            courseStore.sectionCourse?.name || `Экзамен - ${courseStore.examCourse?.title || ""}`
                        )}
                    </h2>
                    <p className="text-sm text-gray-500">{courseStore.sectionCourse?.small_description}</p>
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
                                onRetryQuiz={handleRetryResult}
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
                                onRetryQuiz={handleRetryResult}
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
        </Card>
    );
});
