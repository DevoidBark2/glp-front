import {action, makeAutoObservable} from "mobx";
import {Comment} from "@/shared/api/comments/model";
import {deleteSectionComment, getSectionComments, sendSectionComment} from "@/shared/api/comments";
import {commentMapper} from "@/entities/comments/mappers";
import {message} from "antd";

class CommentsStore {
    constructor() {
        makeAutoObservable(this)
    }

    sectionComments: Comment[] = []
    comment: string = "";


    setComment = action((value: string) => {
        this.comment = value;
    })

    getSectionComments = action(async (sectionId: number) => {
        const data = await getSectionComments(sectionId);

        this.sectionComments = data.map(commentMapper)
    })

    sendSectionComment = action(async (sectionId: number) => {
        const data = await sendSectionComment(sectionId,this.comment)
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