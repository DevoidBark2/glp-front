'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Image from "next/image"
import {Spin} from "antd";

export default function ThemeSwitch() {
    const [mounted, setMounted] = useState(false)
    const { setTheme, resolvedTheme } = useTheme()

    useEffect(() =>  setMounted(true), [])

    if (!mounted) return (
        <Spin size="small"/>
    )

    if (resolvedTheme === 'dark') {
        return <Image src="/static/light_theme_icon.svg" alt={""} width={30} height={30} onClick={() => setTheme('light')}/>
    }

    if (resolvedTheme === 'light') {
        return <Image src="/static/dark_theme_icon.svg" alt=""  width={30} height={30} onClick={() => setTheme('dark')} />
    }

}