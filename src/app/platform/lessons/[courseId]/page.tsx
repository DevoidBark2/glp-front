"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import {
    Layout,
    Card, Divider,
    notification, Skeleton
} from "antd";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CourseComponentType } from "@/shared/api/course/model";
import { FileAttachment, HeaderLesson, LinksAttachment, NavbarLesson } from "@/widgets/Lesson";
import { SimpleTask, QuizComponent, QuizMultiComponent, TextComponent, CommentBlock } from "@/entities/course/ui";
import { useMobxStores } from "@/shared/store/RootStore";
import ExamCourse from "@/entities/exams/ui/ExamCourse";

const { Content } = Layout;

const LessonPage = () => {
    const { courseId } = useParams();
    const { courseStore, commentsStore } = useMobxStores();
    const [selectedSection, setSelectedSection] = useState<number>(0);
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const router = useRouter();




    useEffect(() => {
        courseStore.getFullCourseById(Number(courseId)).then((response) => {
            const stepFromUrl = Number(searchParams.get("step"));
            const initialSectionId: number = stepFromUrl || response?.sections[0].children[0]?.id;
            setSelectedSection(initialSectionId);

            courseStore.getMenuSections(Number(courseId), initialSectionId).then(() => {
                commentsStore.getSectionComments(Number(initialSectionId));
            })

            if (!stepFromUrl) {
                router.push(`/platform/lessons/${courseId}?step=${initialSectionId}`);
            }
        }).catch(e => {
            router.push(`/platform/courses/${courseId}`);
            notification.error({ message: e.response.data.message })
        });

        return () => {
            courseStore.setFullDetailCourse(null);
            courseStore.setCourseMenuItems(null);
            courseStore.setMessageWarning(null)
        }

    }, [courseId]);

    useEffect(() => {
        if (Number(selectedSection) !== 0) {
            courseStore.getMenuSections(Number(courseId), Number(selectedSection)).then(() => {
                commentsStore.sectionComments = []
                commentsStore.getSectionComments(Number(selectedSection));
            })
        }

        return () => {
            courseStore.setMessageWarning(null)
        }

    }, [searchParams])

    return (
        <Layout>
            <HeaderLesson />

            <Layout className="mt-16">
                <NavbarLesson router={router} courseStore={courseStore} collapsed={collapsed} setCollapsed={setCollapsed} selectedSection={selectedSection} setSelectedSection={setSelectedSection} courseId={Number(courseId)} />
                <Layout>
                    <Content style={{ height: 'calc(100vh - 64px)' }}
                        className="m-0 p-6 flex flex-col pl-6 py-4 pr-4 max-h-[calc(100vh-64px)] overflow-y-auto">
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
                                Number(searchParams.get("step")) !== -1 && courseStore.fullDetailCourse?.components && courseStore.fullDetailCourse?.components.map((component) => {
                                    if (component.componentTask.type === CourseComponentType.Text) {
                                        return <TextComponent key={component.id} component={component.componentTask} />
                                    }
                                    if (component.componentTask.type === CourseComponentType.Quiz) {
                                        return <QuizComponent key={component.id} quiz={component.componentTask}
                                            currentSection={selectedSection} />;
                                    }
                                    if (component.componentTask.type === CourseComponentType.MultiPlayChoice) {
                                        return <QuizMultiComponent key={component.id} quiz={component.componentTask}
                                            currentSection={selectedSection} />;
                                    }

                                    if (component.componentTask.type === CourseComponentType.SimpleTask) {
                                        return <SimpleTask key={component.id} task={component.componentTask}
                                            currentSection={selectedSection} />
                                    }
                                })}

                            {
                                Number(searchParams.get("step")) === -1 && <ExamCourse exam={courseStore.examCourse!}/>
                            }

                            {courseStore.messageWarning && <h1>{courseStore.messageWarning}</h1>}

                            {(courseStore.fullDetailCourse?.files && courseStore.fullDetailCourse?.files.length > 0 || courseStore.fullDetailCourse?.links && courseStore.fullDetailCourse?.links.length > 0) &&
                                <Divider />}
                            <div className="space-y-12">
                                <FileAttachment />
                                <LinksAttachment />
                            </div>
                        </Card>
                        {(!courseStore.messageWarning && Number(searchParams.get("step")) !== -1) && <CommentBlock />}
                    </Content>
                </Layout>
            </Layout>
        </Layout>

    );
}

export default observer(LessonPage);