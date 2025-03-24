"use client";
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { Layout, notification } from "antd";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { HeaderLesson, NavbarLesson } from "@/widgets/Lesson";
import { CommentBlock, CourseSectionCard } from "@/entities/course/ui";
import { useMobxStores } from "@/shared/store/RootStore";

const { Content } = Layout;

const LessonPage = () => {
    const { courseId } = useParams();
    const router = useRouter()
    const { courseStore } = useMobxStores();
    const searchParams = useSearchParams();
    const step = Number(searchParams.get('step'))

    useEffect(() => {
        courseStore.getCourseTitleAndMenuById(Number(courseId)).then(response => {
            const firstStep = response.sections[0].children[0].id;
            const currentStep = step || firstStep;
            router.push(`?step=${currentStep}`);
        }).catch(e => {
            notification.error({ message: e.response.data.message });
        });

        return () => {
            courseStore.setSectionCourse(null);
            courseStore.setCourseMenuItems(null);
            courseStore.setMessageWarning(null);
        };

    }, [courseId]);

    return (
        <Layout>
            <HeaderLesson />

            <Layout className="h-[calc(100vh-56px)] overflow-hidden">
                <NavbarLesson />
                <Layout className="flex-1 overflow-hidden">
                    <Content className="m-0 p-6 flex flex-col max-h-full overflow-y-auto dark:bg-[#1a1a1a]">
                        <CourseSectionCard />
                        <CommentBlock />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default observer(LessonPage);