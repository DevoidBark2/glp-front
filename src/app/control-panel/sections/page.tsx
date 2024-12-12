"use client"
import React from "react";
import { observer } from "mobx-react";
import {PageHeader} from "@/shared/ui/PageHeader";
import { useRouter } from "next/navigation";
import { SectionList } from "@/entities/section/ui/SectionList.tsx";
import {PageContainerControlPanel} from "@/shared/ui";

const SectionPage = () => {
    const router = useRouter();

    return (
        <PageContainerControlPanel>
            <PageHeader
                title="Доступные разделы"
                buttonTitle=" Добавить раздел"
                onClickButton={() => router.push('sections/add')}
                showBottomDivider
            />
            <SectionList/>
        </PageContainerControlPanel>
    )
}

export default observer(SectionPage);