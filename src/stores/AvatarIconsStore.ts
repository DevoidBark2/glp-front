import {action, makeAutoObservable} from "mobx";
import {GET, POST} from "@/lib/fetcher";
import {StatusAvatarIconEnum} from "@/enums/StatusAvatarIconEnum";
import dayjs from "dayjs";
import {FORMAT_VIEW_DATE} from "@/constants";
import {notification} from "antd";

export type AvatarIcon = {
    id: string
    image: string,
    status: StatusAvatarIconEnum,
    created_at: Date
}
class AvatarIconsStore {
    constructor() {
        makeAutoObservable(this)
    }

    avatarIcons: AvatarIcon[] = []
    loadingAvatars : boolean = false;
    showCreateModal: boolean = false;

    setShowCreateModal = action((value: boolean) => {
        this.showCreateModal = value
    })
    setLoading = action((value: boolean) => {
        this.loadingAvatars = value;
    })

    getAllAvatarIcons = action(async() => {
        await GET('/api/avatar-icons').then(response => {
            this.avatarIcons = response.data.map(avatarIconsMapper)
        })
    })
    createAvatarIcon = action(async (values) => {
        this.setLoading(true)
        const form = new FormData();
        form.append('image',values.image.originFileObj)

        return await POST('/api/avatar-icons',form).then(response => {
            this.avatarIcons = [...this.avatarIcons,avatarIconsMapper(response.data)]
            notification.success({message: response.message})
        }).finally(() => {
            this.setLoading(false)
            this.setShowCreateModal(false)
        })
    })

    deleteAvatarIcon = action(async () => {

    })
}

const avatarIconsMapper = (icon: AvatarIcon) => {
    const avatarIcon: AvatarIcon = {
        id: icon.id,
        image: icon.image,
        status: icon.status,
        created_at: dayjs(icon.created_at,FORMAT_VIEW_DATE).toDate()
    }

    return avatarIcon;
}

export default AvatarIconsStore