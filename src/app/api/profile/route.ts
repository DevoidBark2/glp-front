import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import nextConfig from "../../../../next.config.mjs";

export async function PUT(req: NextRequest) {
    const token = req.headers.get('authorization');
    const body = await req.json();

    try {
        const { data } = await axios.put(nextConfig.env?.API_URL + `api/profile`, body, {
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