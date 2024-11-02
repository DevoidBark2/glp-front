import { UploadFile } from "antd";
import { User } from "../user/model";

export enum PostStatusEnum {
    NEW = 'new',
    IN_PROCESSING = 'in_processing',
    APPROVED = "approved",
    REJECT = 'reject',
    MODIFIED = "modified"
}

export type PostCreateForm = {
    name: string;
    description: string;
    content: string;
    is_publish?: boolean;
    status?: string;
    image?: UploadFile;
}

export type ModeratorFeedback = {
    id: number;
    comment: string;
    comments: Object
}

export type Post = {
    id: number;
    name: string;
    image: string;
    description: string;
    content: string;
    status: PostStatusEnum;
    is_publish: boolean;
    rejectReason?: string[];
    created_at: Date;
    user: User
    moderatorFeedBack?: ModeratorFeedback
}