import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import nextConfig from "../../../../next.config.mjs";

export async function GET(req: NextRequest) {
    try {
        const { data } = await axios.get(nextConfig.env?.API_URL + 'api/general-settings');

        return NextResponse.json({ ...data });
    } catch (error: any) {
        console.error(error)
        return NextResponse.json(error.response.data, { status: error.response.status })
    }
}


export async function POST(req: NextRequest) {
    const token = req.headers.get('authorization');
    const reqBody = await req.formData();

    try {
        const { data } = await axios.post(nextConfig.env?.API_URL + `api/general-settings`, reqBody, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        });

        return NextResponse.json({ ...data });
    } catch (error: any) {
        console.error(error)
        return NextResponse.json(error.response.data, { status: error.response.status })
    }
}