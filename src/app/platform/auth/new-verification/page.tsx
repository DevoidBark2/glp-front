"use client"
import React, { useEffect } from "react";
import { notification, Spin } from "antd"
import { useRouter, useSearchParams } from "next/navigation"

import { useMobxStores } from "@/shared/store/RootStore"

const NewVerificationPage = () => {
    const {authStore} = useMobxStores()
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    useEffect(() => {
        authStore.verification(token).then(() => {
            notification.success({message: "Почта успешно подтверждена!"})
            router.push('/platform/profile')
        }).catch(e => {
            notification.error({message: e.response.data.message})
            router.push('/platform/auth/login')
        })
    }, [token])


    return <Spin size="large"/>
}

export default NewVerificationPage