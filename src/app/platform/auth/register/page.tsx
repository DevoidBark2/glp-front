"use client"
import React from "react"
import {observer} from "mobx-react";
import { RegisterComponent } from "@/entities/auth";

const RegisterPage = observer(() => {
    return (
       <RegisterComponent/>
    );
})

export default RegisterPage;