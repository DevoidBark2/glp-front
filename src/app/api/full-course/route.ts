import axios from "axios";
import nextConfig from "../../../../next.config.mjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const courserId = searchParams.get('courseId');
    try {
        const { data } = await axios.get(nextConfig.env?.API_URL + `api/full-course?courseId=${courserId}`);

        return NextResponse.json({ ...data });
    } catch (error: any) {
        console.error(error)
        return NextResponse.json(error.response.data, { status: error.response.status })
    }
}

