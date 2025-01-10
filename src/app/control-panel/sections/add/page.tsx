"use client";
import React, {useEffect} from "react";
import { Breadcrumb } from "antd";
import Link from "next/link";
import {PageContainerControlPanel} from "@/shared/ui";
import { FormSteps } from "@/entities/section/ui";
import {useMobxStores} from "@/stores/stores";

const SectionAddPage = () => {
    const {courseStore} = useMobxStores()

    useEffect(() =>{
        return () => {
            courseStore.setSelectedCourse(null);
        }
    })
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
            <h1 className="text-center text-3xl mb-5">Добавление нового раздела</h1>
           <FormSteps/>
        </PageContainerControlPanel>
    );
};

export default SectionAddPage;
