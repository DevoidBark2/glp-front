import { action, makeAutoObservable } from "mobx";
import { GET } from "@/lib/fetcher";
import dayjs from "dayjs";
import { FORMAT_VIEW_DATE } from "@/constants";
import { ActionEvent } from "@/shared/api/action-user";

export type EventUser = {
    id: number;
    action: ActionEvent;
    description: string;
    createdAt: Date;
}

class EventStore {
    constructor() {
        makeAutoObservable(this)
    }

    userEvents: EventUser[] = []
    loadingEvents: boolean = false;

    setLoadingEvents = action((value: boolean) => {
        this.loadingEvents = value;
    })

    getAllEvents = action(async () => {
        this.setLoadingEvents(true)
        return await GET(`/api/events`).then((response) => {
            this.userEvents = response.data.map(eventMapper)
        });
    })
}

const eventMapper = (value: any) => {
    return {
        id: value.id,
        action: value.action,
        description: value.description,
        createdAt: dayjs(value.created_at, FORMAT_VIEW_DATE).toDate(),
        user: {
            id: value.user.id,
            name: value.user.first_name + " " + value.user.last_name,
        },
    }
}
export default EventStore;