"use client"
import { useParams, useRouter } from "next/navigation";
import { Breadcrumb, Divider, Form, notification, Tabs } from "antd";
import React, { useEffect } from "react";
import Link from "next/link";
import { observer } from "mobx-react";
import { PageContainerControlPanel } from "@/shared/ui";
import 'react-quill/dist/quill.snow.css';
import { useMobxStores } from "@/shared/store/RootStore";
import { CourseSections } from "@/entities/course/ui";
import { CourseMembers } from "@/entities/course/ui/ControlPanel/CourseMembers";
import { AddationalSettings } from "@/entities/course/ui/ControlPanel/AddationalSettings";
import { CourseDetailsMain } from "@/entities/course/ui/ControlPanel/CourseDetailsMain";
import { AccessRightEnum, Course } from "@/shared/api/course/model";

const CoursePage = () => {
    const { courseId } = useParams();
    const { courseStore, nomenclatureStore, examStore } = useMobxStores();
    const [form] = Form.useForm<Course>();
    const router = useRouter();

    useEffect(() => {
        nomenclatureStore.getCategories();
        courseStore.getCourseDetailsById(Number(courseId)).then(response => {
            form.setFieldsValue(response);
            form.setFieldValue("category", response.category?.id);
            courseStore.setCoursePageTitle(response.name)
            courseStore.setSecretKey(response.secret_key)
            courseStore.setAccessRight(response.access_right === AccessRightEnum.PUBLIC ? 0 : 1)

            courseStore.getCourseDetailsSections(Number(courseId));
            courseStore.getAllMembersCourse(Number(courseId));
            examStore.getUserExams();
        }).catch(e => {
            router.push('/control-panel/courses')
            notification.warning({ message: e.response.data.result })
        }).finally(() => {
            courseStore.setLoadingCourseDetails(false)
        })
    }, [courseId]);

    return (
        <PageContainerControlPanel>
            <div className="flex items-center justify-between">
                <Breadcrumb items={[{
                    title: <Link href={"/control-panel/courses"}>Доступные курсы</Link>,
                }, {
                    title: <p>{courseStore.coursePageTitle}</p>,
                }]} />
            </div>
            <h1 className="text-center text-3xl">Редактирование курса</h1>
            <Divider />

            <Tabs
                defaultActiveKey="1"
                items={
                    [
                        {
                            key: '1',
                            label: 'Основное',
                            children: <CourseDetailsMain form={form} />
                        },
                        {
                            key: '2',
                            label: 'Разделы и компоненты',
                            children: <CourseSections />,
                        },
                        {
                            key: '3',
                            label: 'Участники курса',
                            children: <CourseMembers />
                        },
                        {
                            key: '4',
                            label: 'Дополнительные параметры',
                            children: <AddationalSettings form={form}/>,
                        }
                    ]}
            />
        </PageContainerControlPanel>)
}
export default observer(CoursePage);