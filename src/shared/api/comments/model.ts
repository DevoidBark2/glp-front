import {User} from "@/shared/api/user/model";

export type Comment = {
    id: string;
    createdAt: Date,
    text: string;
    user: User
}