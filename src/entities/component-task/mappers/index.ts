import dayjs from "dayjs";

import {CourseComponent} from "@/shared/api/component/model";

export const componentTaskMapper = (state: CourseComponent) => {
    const component: any = {
        id: state.id,
        description: state.description,
        questions: state.questions,
        type: state.type,
        content_description: state.content_description,
        title: state.title,
        status: state.status,
        user: state.user,
        created_at: dayjs(state.created_at).toDate()
    }

    return component;
}