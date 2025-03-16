"use client"
import { Divider } from "antd";
import { observer } from "mobx-react"
import { useEffect } from "react";

import { useMobxStores } from "@/shared/store/RootStore"
import { FaqList } from "@/entities/faq"

const FaqPage = () => {
    const { faqStore } = useMobxStores();

    useEffect(() => {
        faqStore.getAll();
    }, [])

    return (
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <h1 className="text-3xl font-semibold mt-6">Вопросы и ответы</h1>
                </div>
            </div>
            <Divider className="my-6" />
            <FaqList />
        </div>
    )
}

export default observer(FaqPage);