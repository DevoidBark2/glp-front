"use client"
import React, { Suspense, useEffect } from "react";
import { notification, Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

import { useMobxStores } from "@/shared/store/RootStore";

const NewVerificationPage = () => {
    const { authStore } = useMobxStores();
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            authStore.verification(token).then(() => {
                notification.success({ message: "Почта успешно подтверждена!" });
                router.push('/platform/profile');
            }).catch(e => {
                notification.error({ message: e.response.data.message });
                router.push('/platform/auth/login');
            });
        }
    }, [authStore, router, token]);

    return (
        <div className="flex justify-center">
            <Spin size="large" />
        </div>
    );
};

const SuspenseWrapper = () => (
        <Suspense fallback={<div className="flex justify-center"><Spin size="large" /></div>}>
            <NewVerificationPage />
        </Suspense>
    );

export default SuspenseWrapper;
