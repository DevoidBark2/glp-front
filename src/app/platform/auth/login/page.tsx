"use client"
import React from "react";
import { observer } from "mobx-react";
import { LoginComponent } from "@/entities/auth";

const LoginPage = observer(() => {
    return (
       <LoginComponent/>
    )
})


export default LoginPage