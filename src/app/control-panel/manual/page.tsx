"use client";
import React from "react";
import {PageContainerControlPanel, PageHeader} from "@/shared/ui";

const ManualPage = () => {
    return (
        <PageContainerControlPanel>
            <PageHeader
                title="Руководство пользователя"
                showBottomDivider
            />
        </PageContainerControlPanel>
    );
};

export default ManualPage;
