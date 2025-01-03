import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import nextConfig from "../../../../next.config.mjs";

export async function GET(req: NextRequest) {
    const token = req.headers.get('authorization');

    try {
        const { data } = await axios.get(nextConfig.env?.API_URL + `api/user-settings`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return NextResponse.json({ ...data });
    } catch (error: any) {
        console.error(error)
        return NextResponse.json(error.response.data, { status: error.response.status })
    }
}

export async function PUT(req: NextRequest) {
    const token = req.headers.get('authorization');

    const { changeUserSettings } = await req.json();

    try {
        const { data } = await axios.put(nextConfig.env?.API_URL + 'api/user-settings', changeUserSettings, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return NextResponse.json({ ...data });
    } catch (error: any) {
        console.error(error)
        return NextResponse.json(error.response.data, { status: error.response.status })
    }
}