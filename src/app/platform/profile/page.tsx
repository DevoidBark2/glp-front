"use client";
import { Spin } from "antd";
import { observer } from "mobx-react";
import React, {useEffect, useState} from "react";
import { CourseUserProfile } from "@/widgets/CoursesUserProfile";
import { UserProfileBlock } from "@/widgets/UserProfile";
import { useMobxStores } from "@/shared/store/RootStore";
import ThemeSwitch from "@/shared/ui/themeSwitch";
import CyberFrame from "@/shared/ui/Cyberpunk/CyberFrame";
import CyberTextUnderline from "@/shared/ui/Cyberpunk/CyberTextUnderline";
import { motion } from "framer-motion";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {useTheme} from "next-themes";

const ProfilePage = () => {
    const { userProfileStore } = useMobxStores();
    const [isRotating, setIsRotating] = useState(false);
    const router = useRouter()

    const handleClick = () => {
        setIsRotating(true);
        const routerSound = new Audio("/sounds/click.wav");
        routerSound.play();
        setTimeout(() => {
            router.push("/platform/settings");
        }, 500);
    };

    const { theme, setTheme } = useTheme();

    useEffect(() => {
        userProfileStore.getUserProfile().finally(() => {
            userProfileStore.setLoading(false)
        });
    }, []);

    return (
        !userProfileStore.loading ? (
            <div className="container mx-auto mt-4 px-48">
                <ThemeSwitch/>
                <CyberFrame width="full">
                    <CyberTextUnderline underline>
                        <div className="flex justify-between items-center">
                            <h1>Профиль пользователя</h1>
                            <motion.button
                                onClick={handleClick}
                                animate={{rotate: isRotating ? 360 : 0}}
                                transition={{duration: 0.5}}
                                className="p-2 rounded-full"
                            >
                                <Image src="/static/settings_icon.svg" alt="Settings" width={40} height={40}/>
                            </motion.button>
                        </div>
                    </CyberTextUnderline>
                    <UserProfileBlock/>
                </CyberFrame>

                <div className="mt-10">
                    <CyberFrame width="full">
                        <CyberTextUnderline underline>
                            Ваши курсы
                        </CyberTextUnderline>
                        <CourseUserProfile/>
                    </CyberFrame>
                </div>
            </div>
        ) : <div className="flex justify-center items-center custom-height-screen">
            <Spin size="large"/>
        </div>
    );
};

export default observer(ProfilePage);
