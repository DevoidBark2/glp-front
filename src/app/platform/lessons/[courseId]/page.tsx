"use client";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import {
    Layout,
    Card, Divider,
    notification
} from "antd";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { useMobxStores } from "@/stores/stores";
import { CourseComponentType } from "@/shared/api/course/model";
import { QuizComponent } from "@/entities/course/ui/QuizComponent";
import { QuizMultiComponent } from "@/entities/course/ui/QuizMultiComponent";
import { TextComponent } from "@/entities/course/ui/TextComponent";
import { FileAttachment, HeaderLesson, LinksAttachment, NavbarLesson } from "@/widgets/Lesson";

const { Content } = Layout;

const LessonPage = () => {
    const { courseId } = useParams();
    const { courseStore } = useMobxStores();
    const [selectedSection, setSelectedSection] = useState<number>(0);
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        courseStore.getFullCourseById(Number(courseId)).then((response) => {
            const stepFromUrl = Number(searchParams.get("step"));
            const initialSectionId: number = stepFromUrl || response?.sections[0].children[0]?.id;
            setSelectedSection(initialSectionId);

            courseStore.getMenuSections(Number(courseId), initialSectionId)

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
        }

    }, [courseId]);

    useEffect(() => {
        if (Number(selectedSection) !== 0) {
            courseStore.getMenuSections(Number(courseId), Number(selectedSection))
        }

    }, [searchParams])

    return (
        <Layout>
            <HeaderLesson router={router} courseStore={courseStore} />

            <Layout className="mt-16">
                <NavbarLesson router={router} courseStore={courseStore} collapsed={collapsed} setCollapsed={setCollapsed} selectedSection={selectedSection} setSelectedSection={setSelectedSection} courseId={Number(courseId)} />
                <Layout className={`${collapsed ? "ml-20" : "ml-72"}`}>
                    <Content style={{ height: 'calc(100vh - 64px)' }} className="m-0 p-6 flex flex-col pl-6 py-4 pr-4 max-h-[calc(100vh-64px)] overflow-y-auto">
                        <Card
                            loading={courseStore.loadingSection}
                            bordered={false}
                            title={
                                <div className="space-y-2 my-4">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {courseStore.fullDetailCourse?.name}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {courseStore.fullDetailCourse?.small_description}
                                    </p>
                                </div>
                            }
                        >
                            {
                                courseStore.fullDetailCourse?.components.map((component) => {
                                    if (component.componentTask.type === CourseComponentType.Text) {
                                        return <TextComponent key={component.id} component={component.componentTask} />
                                    }
                                    if (component.componentTask.type === CourseComponentType.Quiz) {
                                        return <QuizComponent key={component.id} quiz={component.componentTask}
                                            currentSection={selectedSection} />;
                                    }
                                    if (component.componentTask.type === CourseComponentType.MultiPlayChoice) {
                                        return <QuizMultiComponent key={component.id} quiz={component.componentTask} currentSection={selectedSection} />;
                                    }
                                })}

                            {(courseStore.fullDetailCourse?.files && courseStore.fullDetailCourse?.files.length > 0 || courseStore.fullDetailCourse?.links && courseStore.fullDetailCourse?.links.length > 0) && <Divider />}
                            <div className="space-y-12">
                                <FileAttachment />
                                <LinksAttachment />
                            </div>
                        </Card>
                    </Content>
                </Layout>
            </Layout>
        </Layout>

    );
}

export default observer(LessonPage);