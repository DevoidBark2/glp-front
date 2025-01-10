import {ActionEvent} from "@/shared/api/action-user";

export type EventUser = {
    id: number;
    action: ActionEvent;
    description: string;
    createdAt: Date;
}
