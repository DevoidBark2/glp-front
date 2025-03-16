import { action, makeAutoObservable } from "mobx";
import { message } from "antd";

import { Comment } from "@/shared/api/comments/model";
import { deleteSectionComment, getSectionComments, sendSectionComment } from "@/shared/api/comments";
import { commentMapper } from "@/entities/comments/mappers";

class CommentsStore {
    constructor() {
        makeAutoObservable(this)
    }

    sectionComments: Comment[] = []
    comment: string = "";


    setSectionComments = action((comments: Comment[]) => {
        this.sectionComments = comments.map(commentMapper);
    })

    setComment = action((value: string) => {
        this.comment = value;
    })

    getSectionComments = action(async (sectionId: number) => {
        this.sectionComments = []
        await getSectionComments(sectionId).then(response => {
            this.setSectionComments(response)
        });
    })

    sendSectionComment = action(async (sectionId: number) => {
        const data = await sendSectionComment(sectionId, this.comment)
        this.sectionComments = [commentMapper(data.data), ...this.sectionComments];
        this.setComment("");
        message.success(data.message)
    })

    deleteSectionComment = action(async (id: string) => {
        const data = await deleteSectionComment(id);
        this.sectionComments = this.sectionComments.filter(comment => comment.id !== id);
        message.success(data.message)
    })
}

export default CommentsStore