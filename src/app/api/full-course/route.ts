import axios from "axios";
import nextConfig from "../../../../next.config.mjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const courserId = searchParams.get('courseId');
    const token = req.headers.get('authorization');
    console.log(token)
    try {
        const { data } = await axios.get(nextConfig.env?.API_URL + `api/full-course?courseId=${courserId}`,{
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

