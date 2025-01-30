"use client";
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { Layout, notification } from "antd";
import { useParams } from "next/navigation";
import { HeaderLesson, NavbarLesson } from "@/widgets/Lesson";
import { CommentBlock, CourseSectionCard } from "@/entities/course/ui";
import { useMobxStores } from "@/shared/store/RootStore";

const { Content } = Layout;

const LessonPage = () => {
    const { courseId } = useParams();
    const { courseStore } = useMobxStores();

    useEffect(() => {
        courseStore.getCourseTitleAndMenuById(Number(courseId)).catch(e => {
            //router.push(`/platform/courses/${courseId}`);
            notification.error({ message: e.response.data.message })
        });

        return () => {
            courseStore.setFullDetailCourse(null);
            courseStore.setCourseMenuItems(null);
            courseStore.setMessageWarning(null)
        }

    }, [courseId]);

    return (
        <Layout>
            <HeaderLesson />

            <Layout className="mt-16">
                <NavbarLesson courseId={Number(courseId)} />
                <Layout>
                    <Content className="m-0 p-6 flex flex-col pl-6 py-4 pr-4 max-h-[calc(100vh-64px)] overflow-y-auto">
                        <CourseSectionCard />
                        <CommentBlock />
                    </Content>
                </Layout>
            </Layout>
        </Layout>

    );
}

export default observer(LessonPage);