"use client"
import React from "react"
import {observer} from "mobx-react";

import { RegisterComponent } from "@/entities/auth";

const RegisterPage = observer(() => (
       <RegisterComponent/>
    ))

export default RegisterPage;