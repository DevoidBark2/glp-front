"use client"
import { observer } from 'mobx-react-lite';
import React from "react";
import { Posts } from "@/widgets";

const PlatformPage = () => {
    return <Posts/>
}

export default observer(PlatformPage);