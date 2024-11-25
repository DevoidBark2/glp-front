"use client";
import React from "react";
import { Breadcrumb } from "antd";
import Link from "next/link";
import PageContainerControlPanel from "@/components/PageContainerControlPanel/PageContainerControlPanel";
import { FormSteps } from "@/entities/section/ui";

const SectionAddPage = () => {
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
