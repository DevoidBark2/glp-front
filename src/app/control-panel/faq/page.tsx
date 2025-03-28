"use client"
import React from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";

import { PageContainerControlPanel } from "@/shared/ui";
import { PageHeader } from "@/shared/ui/PageHeader";
import { FaqControlList } from "@/entities/faq";

const FaqPage = () => {
    const router = useRouter()

    return (
        <PageContainerControlPanel>
            <PageHeader
                title="Вопросы и ответы"
                buttonTitle="Добавить FAQ"
                onClickButton={() => router.push('/control-panel/faq/add')}
                showBottomDivider
            />
            <FaqControlList />
        </PageContainerControlPanel>
    );
};

export default observer(FaqPage);
