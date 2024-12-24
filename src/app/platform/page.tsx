"use client"
import { observer } from 'mobx-react-lite';
import React from "react";
import { Posts } from "@/widgets";
import {Metadata} from "next";

// export const metadata: Metadata = {
//     title: "Main page"
// }
const PlatformPage = () => {
    return <Posts/>
}

export default observer(PlatformPage);