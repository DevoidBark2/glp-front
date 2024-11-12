import { action, makeAutoObservable } from "mobx";
import { DELETE, GET, POST } from "@/lib/fetcher";
import dayjs from "dayjs";
import { FORMAT_VIEW_DATE } from "@/constants";
import { notification } from "antd";
import { StatusAvatarIconEnum } from "@/shared/api/avatar-icon";

export type AvatarIcon = {
    id: number
    image: string,
    status: StatusAvatarIconEnum,
    created_at: Date
}
class AvatarIconsStore {
    constructor() {
        makeAutoObservable(this)
    }

    avatarIcons: AvatarIcon[] = []
    loadingAvatars: boolean = false;
    showCreateModal: boolean = false;

    setShowCreateModal = action((value: boolean) => {
        this.showCreateModal = value
    })
    setLoading = action((value: boolean) => {
        this.loadingAvatars = value;
    })

    getAllAvatarIcons = action(async () => {
        await GET('/api/avatar-icons').then(response => {
            this.avatarIcons = response.data.map(avatarIconsMapper)
        })
    })
    createAvatarIcon = action(async (values: any) => {
        this.setLoading(true)
        const form = new FormData();
        form.append('image', values.image.originFileObj)

        return await POST('/api/avatar-icons', form).then(response => {
            this.avatarIcons = [...this.avatarIcons, avatarIconsMapper(response.data)]
            notification.success({ message: response.message })
        }).finally(() => {
            this.setLoading(false)
            this.setShowCreateModal(false)
        })
    })

    deleteAvatarIcon = action(async (id: number) => {
        return await DELETE(`/api/avatar-icons?id=${id}`).then(response => {
            this.avatarIcons = this.avatarIcons.filter(icon => icon.id !== id);
            notification.success({ message: response.message })
        }).finally(() => {
            this.setLoading(false)
            this.setShowCreateModal(false)
        })
    })
}

const avatarIconsMapper = (icon: AvatarIcon) => {
    const avatarIcon: AvatarIcon = {
        id: icon.id,
        image: icon.image,
        status: icon.status,
        created_at: dayjs(icon.created_at, FORMAT_VIEW_DATE).toDate()
    }

    return avatarIcon;
}

export default AvatarIconsStore