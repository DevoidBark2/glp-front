import React from "react";
import { observer } from "mobx-react";
import { Divider, Typography } from "antd";
import dayjs from "dayjs";
import { useTheme } from "next-themes";

import { FORMAT_VIEW_DATE } from "@/shared/constants";
import { useMobxStores } from "@/shared/store/RootStore";

const { Text } = Typography;

export const AddationalInfo = observer(() => {
    const { userProfileStore } = useMobxStores();
    const { resolvedTheme } = useTheme()


    return (
        <div className="container mx-auto">
            <h1 className="text-2xl dark:text-white">Дополнительная информация</h1>
            <Divider style={{ borderColor: resolvedTheme === "dark" ? "gray" : undefined }} />
            <div>
                <Text strong className="dark:text-white">Дата регистрации:</Text>
                <Text className="ml-2 dark:text-white">{dayjs(userProfileStore.userProfile?.created_at).format(FORMAT_VIEW_DATE)}</Text>
            </div>
        </div>
    );
});
