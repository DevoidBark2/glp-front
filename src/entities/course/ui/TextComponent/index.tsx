import { CourseComponentTypeI } from "@/shared/api/course/model";
import { observer } from "mobx-react";

interface TextComponentProps {
    component: CourseComponentTypeI
}

// Вывод только content_description

export const TextComponent = observer(({component}: TextComponentProps) => {
    return (
        <div key={component.id} className="mb-6">
            {/* {component.title && (
                <h3 className="text-xl font-medium text-gray-700 mb-4">
                    {component.title}
                </h3>
            )} */}
            <div
                className="prose prose-lg text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{
                    __html: component.content_description || '',
                }}
            />
        </div>
    )
})