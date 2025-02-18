import { observer } from "mobx-react";
import {CourseComponent} from "@/shared/api/component/model";

interface TextComponentProps {
    component: CourseComponent
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