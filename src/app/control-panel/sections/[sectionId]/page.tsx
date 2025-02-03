"use client"
import {PageContainerControlPanel} from "@/shared/ui";
import { Breadcrumb, Form } from "antd"
import { observer } from "mobx-react"
import Link from "next/link"
import { FormSteps } from "@/entities/section/ui"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import {useMobxStores} from "@/shared/store/RootStore";

const SectionDetailsPage = () => {
    const { sectionCourseStore } = useMobxStores();
    const [sectionCourseForm] = Form.useForm();
    const {sectionId} = useParams();
    

    useEffect(() => {
        sectionCourseStore.getMenuSections(Number(sectionId)).then(response => {
            sectionCourseForm.setFieldsValue(response);
        });
    },[sectionId])

    return (
        <PageContainerControlPanel>
            <Breadcrumb
                items={[
                    {
                        title: <Link href={"/control-panel/sections"}>Доступные разделы</Link>,
                    },
                    {
                        title: <span>Новый раздел</span>,
                    },
                ]}
            />
            <h1 className="text-center text-3xl mb-5">Изменение раздела</h1>
           <FormSteps sectionCourseForm={sectionCourseForm}/>
        </PageContainerControlPanel>
    )
}

export default observer(SectionDetailsPage);