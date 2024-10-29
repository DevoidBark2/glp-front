import { action, makeAutoObservable } from "mobx";
import { User } from "./UserStore";
import { GET, POST } from "@/lib/fetcher";
import { notification, UploadFile } from "antd";
import dayjs from "dayjs";
import { FORMAT_VIEW_DATE } from "@/constants";

export type FeedBackItem = {
    id: string,
    sender: User,
    recipient: User,
    message: string,
    sent_at: Date,
    attachments: string[]
}

class FeedBacksStore {
    constructor() {
        makeAutoObservable(this);
    }

    feedBackItems: FeedBackItem[] = [];
    fileListForFeedback: UploadFile[] = [];

    setFileForFeedBack = action((files: UploadFile[]) => {
        this.fileListForFeedback = files;
    });

    sendFeedback = action(async (data: any) => {
        const formData = new FormData();
        formData.append('message', data.message);

        this.fileListForFeedback.forEach(file => {
            formData.append('files', file.originFileObj)
        })
        await POST("/api/send-feedback", formData).then(response => {
            this.setFileForFeedBack([]);
            this.feedBackItems = [...this.feedBackItems, feedBackMapper(response.data)]
            notification.success({ message: response.message })
        }).catch(e => {
            notification.error({ message: e.response.data.message })
        })
    })


    getFeedBackForUser = action(async () => {
        await GET('/api/get-feedback-for-user').then(response => {
            this.feedBackItems = response.data.map(feedBackMapper)
        })
    })
}

const feedBackMapper = (feedBack: FeedBackItem) => {
    const feedBackItem: FeedBackItem = {
        id: feedBack.id,
        message: feedBack.message,
        sent_at: dayjs(feedBack.sent_at, FORMAT_VIEW_DATE).toDate(),
        sender: feedBack.sender,
        recipient: feedBack.recipient,
        attachments: feedBack.attachments,
    }

    return feedBackItem;
}

export default FeedBacksStore;