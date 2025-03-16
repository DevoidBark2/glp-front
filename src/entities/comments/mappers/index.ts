import dayjs from "dayjs";

import {Comment} from "@/shared/api/comments/model";

export const commentMapper = (comment: Comment): any => ({
        id: comment.id,
        text: comment.text,
        createdAt: dayjs(comment.createdAt).toDate(),
        user: comment.user,
    })