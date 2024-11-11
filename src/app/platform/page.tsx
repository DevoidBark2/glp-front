"use client"
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { useMobxStores } from "@/shared/store/RootStore";
import { Posts } from "@/widgets";

const PlatformPage = () => {
    const { postStore } = useMobxStores();

    useEffect(() => {
        postStore.getAllPosts()
    }, [])

    return <Posts/>
}

export default observer(PlatformPage);