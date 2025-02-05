"use client"
import {PageContainerControlPanel} from "@/shared/ui";
import { Breadcrumb, Form } from "antd"
import { observer } from "mobx-react"
import Link from "next/link"
import { FormSteps } from "@/entities/section/ui"
import { useParams } from "next/navigation"
import {useEffect, useState} from "react"
import {useMobxStores} from "@/shared/store/RootStore";
import {SectionCourseItem} from "@/shared/api/section/model";

const SectionDetailsPage = () => {
    const { sectionCourseStore, courseStore, courseComponentStore } = useMobxStores();
    const [sectionCourseForm] = Form.useForm<SectionCourseItem>();
    const [sectionName, setSectionName] = useState("");
    const {sectionId} = useParams();
    

    useEffect(() => {
        sectionCourseStore.getCourseSectionById(Number(sectionId)).then(response => {
            setSectionName(response.name)
            courseStore.setSelectedCourse(response.course.id)
            sectionCourseForm.setFieldsValue(response)
            sectionCourseForm.setFieldValue("components",response.sectionComponents.map(it => it.componentTask));
            courseComponentStore.setSelectedComponent(response.sectionComponents.map(it => it.componentTask))
        });
    },[sectionId, sectionCourseForm])

    return (
        <PageContainerControlPanel>
            <Breadcrumb
                items={[
                    {
                        title: <Link href={"/control-panel/sections"}>Доступные разделы</Link>,
                    },
                    {
                        title: <span>{sectionName}</span>,
                    },
                ]}
            />
            <h1 className="text-center text-3xl mb-5">Изменение раздела</h1>
           <FormSteps sectionCourseForm={sectionCourseForm}/>
        </PageContainerControlPanel>
    )
}

export default observer(SectionDetailsPage);