"use client"
import { FaqList } from "@/entities/faq"
import { useMobxStores } from "@/shared/store/RootStore"
import { observer } from "mobx-react"
import { useEffect } from "react";

const FaqPage = () => {
    const { faqStore } = useMobxStores();

    useEffect(() => {
        faqStore.getAll();
    }, [])
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                Вопросы и ответы
            </h1>
            <FaqList faqs={faqStore.faqs} />
        </div>
    )
}

export default observer(FaqPage);