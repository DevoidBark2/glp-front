export enum PostStatusEnum {
    NEW = 'new',
    IN_PROCESSING = 'in_processing',
    APPROVED = "approved",
    REJECT = 'reject',
    MODIFIED = "modified"
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