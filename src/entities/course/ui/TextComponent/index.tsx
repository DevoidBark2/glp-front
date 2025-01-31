import { CourseComponentTypeI } from "@/shared/api/course/model";
import { observer } from "mobx-react";

interface TextComponentProps {
    component: CourseComponentTypeI
}

export const TextComponent = observer(({component}: TextComponentProps) => {
    return (
        <div className="mb-6">
            <div
                className="prose prose-lg text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{
                    __html: component.content_description || '',
                }}
            />
        </div>
    )
})