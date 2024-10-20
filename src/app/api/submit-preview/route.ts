import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import nextConfig from "../../../../next.config.mjs";

export async function PUT(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const token = req.headers.get('authorization');
    const postId = searchParams.get('postId');

    try {
        const { data } = await axios.put(nextConfig.env?.API_URL + `api/submit-preview?postId=${postId}`, {}, {
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