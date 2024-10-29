import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import nextConfig from "../../../../next.config.mjs";

export async function PUT(req: NextRequest) {
    const token = req.headers.get('authorization');
    const form = await req.formData();

    try {
        const { data } = await axios.put(nextConfig.env?.API_URL + `api/upload-avatar`, form, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });

        return NextResponse.json({ ...data });
    } catch (error: any) {
        console.error(error)
        return NextResponse.json(error.response.data, { status: error.response.status })
    }
}