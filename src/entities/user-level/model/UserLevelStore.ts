import {action, makeAutoObservable} from "mobx";
import {UserLevel} from "@/shared/api/users-level/model";
import {getAllUsersLevel} from "@/shared/api/users-level";

class UserLevelStore {
    constructor() {
        makeAutoObservable(this)
    }

    leaderBordUsers: UserLevel[] = []

    setLeaderBordUsers = action((leaderUsers: UserLevel[]) => {
        this.leaderBordUsers = leaderUsers
    })

    getAllUsersLevel = action(async () => {
        const data = await getAllUsersLevel()

        this.setLeaderBordUsers(data)
    })
}

export default UserLevelStore