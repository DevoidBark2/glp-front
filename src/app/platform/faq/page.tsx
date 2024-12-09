"use client"
import { FaqList } from "@/entities/faq"
import { useMobxStores } from "@/shared/store/RootStore"
import { Divider } from "antd";
import { observer } from "mobx-react"
import { useEffect } from "react";

const FaqPage = () => {
    const { faqStore } = useMobxStores();

    useEffect(() => {
        faqStore.getAll();
    }, [])
    return (
        <div className="container mx-auto py-6">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <h1 className="text-3xl font-semibold text-gray-800">Вопросы и ответы</h1>
                </div>
            </div>
            <Divider className="my-6" />
            <FaqList faqs={faqStore.faqs} />
        </div>
    )
}

export default observer(FaqPage);