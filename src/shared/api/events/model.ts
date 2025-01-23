import {ActionEvent} from "@/shared/api/action-user";
import {User} from "@/shared/api/user/model";

export type EventUser = {
    id: number;
    action: ActionEvent;
    description: string;
    success: boolean;
    user: User;
    createdAt: Date;
}
