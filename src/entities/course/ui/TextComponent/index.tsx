import { observer } from "mobx-react";
import { ComponentTask } from "@/shared/api/course/model";

interface TextComponentProps {
    component: ComponentTask
}

export const TextComponent = observer(({ component }: TextComponentProps) => {
    return (
        <div className="mb-6">
            <div
                className="prose prose-lg text-gray-600 leading-relaxed dark:text-white"
                dangerouslySetInnerHTML={{
                    __html: component.content_description || '',
                }}
            />
        </div>
    )
})