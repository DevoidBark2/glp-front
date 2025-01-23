import { action, makeAutoObservable } from "mobx";
import {EventUser} from "@/shared/api/events/model";
import {getAllEvents} from "@/shared/api/events";

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
        return await getAllEvents().then((response) => {
            this.userEvents = response.map(eventMapper)
        });
    })
}

const eventMapper = (value: any) => {
    return {
        id: value.id,
        action: value.action,
        description: value.description,
        createdAt: value.created_at,
        success: value.success,
        user: value.user
    }
}
export default EventStore;