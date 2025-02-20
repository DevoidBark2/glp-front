import { useMobxStores } from "@/shared/store/RootStore";
import { observer } from "mobx-react";
import { Divider, Typography } from "antd";
import dayjs from "dayjs";
import { FORMAT_VIEW_DATE } from "@/shared/constants";

const { Text } = Typography;

export const AddationalInfo = observer(() => {
    const { userProfileStore } = useMobxStores();


    return (
        <div className="container mx-auto">
            <h1 className="text-2xl">Дополнительная информация</h1>
            <Divider />
            <div>
                <Text strong>Дата регистрации:</Text>
                <Text className="ml-2">{dayjs(userProfileStore.userProfile?.created_at).format(FORMAT_VIEW_DATE)}</Text>
            </div>
        </div>
    );
});
