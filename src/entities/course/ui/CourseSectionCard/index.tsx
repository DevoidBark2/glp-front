import { CourseComponentType } from "@/shared/api/course/model";
import { useMobxStores } from "@/shared/store/RootStore";
import { Card, Divider, Skeleton } from "antd";
import { observer } from "mobx-react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { TextComponent } from "../TextComponent";
import { QuizComponent } from "../QuizComponent";
import { QuizMultiComponent } from "../QuizMultiComponent";
import { SimpleTask } from "../SimpleTask";
import { FileAttachment, LinksAttachment } from "@/widgets/Lesson";
import ExamCourse from "@/entities/exams/ui/ExamCourse";
import { isExamCoursePage } from "../../selectors";

export const CourseSectionCard = observer(() => {
    const { courseStore, commentsStore } = useMobxStores()
    const searchParams = useSearchParams();
    const { courseId } = useParams();
    const step = Number(searchParams.get('step'))

    useEffect(() => {
        if (step !== 0) {
            courseStore.getMenuSections(Number(courseId), step).then(() => {
                commentsStore.sectionComments = []
                commentsStore.getSectionComments(step);
            })
        }

        return () => {
            courseStore.setMessageWarning(null)
        }

    }, [searchParams])

    return (
        <Card
            loading={courseStore.loadingSection}
            bordered={false}
            title={
                <div className="space-y-2 my-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {courseStore.loadingSection ? (
                            <Skeleton.Input />
                        ) : (
                            courseStore.fullDetailCourse?.name || `Экзамен - ${courseStore.examCourse?.title || ''}`
                        )}

                    </h2>
                    <p className="text-sm text-gray-500">
                        {courseStore.fullDetailCourse?.small_description}
                    </p>
                </div>
            }
        >
            {
                !isExamCoursePage(searchParams) && courseStore.fullDetailCourse?.components && courseStore.fullDetailCourse?.components.map((component) => {
                    if (component.componentTask.type === CourseComponentType.Text) {
                        return <TextComponent key={component.id} component={component.componentTask} />
                    }
                    if (component.componentTask.type === CourseComponentType.Quiz) {
                        return <QuizComponent key={component.id} quiz={component.componentTask}
                            currentSection={step} />;
                    }
                    if (component.componentTask.type === CourseComponentType.MultiPlayChoice) {
                        return <QuizMultiComponent key={component.id} quiz={component.componentTask}
                            currentSection={step} />;
                    }

                    if (component.componentTask.type === CourseComponentType.SimpleTask) {
                        return <SimpleTask key={component.id} task={component.componentTask}
                            currentSection={step} />
                    }
                })}

            {
                isExamCoursePage(searchParams) && <ExamCourse exam={courseStore.examCourse!} />
            }

            {courseStore.messageWarning && <h1>{courseStore.messageWarning}</h1>}

            {(courseStore.fullDetailCourse?.files && courseStore.fullDetailCourse?.files.length > 0 || courseStore.fullDetailCourse?.links && courseStore.fullDetailCourse?.links.length > 0) &&
                <Divider />}
            <div className="space-y-12">
                <FileAttachment />
                <LinksAttachment />
            </div>
        </Card>
    )
})