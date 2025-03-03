import { action, makeAutoObservable } from "mobx";
import { UserLevel } from "@/shared/api/users-level/model";
import { getAllUsersLevel } from "@/shared/api/users-level";

class UserLevelStore {
    constructor() {
        makeAutoObservable(this)
    }

    loading: boolean = false
    leaderBordUsers: UserLevel[] = []

    setLoading = action((value: boolean) => {
        this.loading = value
    })

    setLeaderBordUsers = action((leaderUsers: UserLevel[]) => {
        this.leaderBordUsers = leaderUsers
    })

    getAllUsersLevel = action(async () => {
        this.setLoading(true)
        const data = await getAllUsersLevel()

        this.setLeaderBordUsers(data)
        this.setLoading(false)
    })
}

export default UserLevelStore