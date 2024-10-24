import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import nextConfig from "../../../../next.config.mjs";

export async function GET(req: NextRequest) {
    const token = req.headers.get('authorization');

    try {
        const response = await axios.get(nextConfig.env?.API_URL + `api/posts?token=${token}`);

        const responseData = response.data;
        return NextResponse.json({ response: responseData });
    } catch (error: any) {
        console.error(error)
        return NextResponse.json(error.response.data, { status: error.response.status })
    }
}


export async function POST(req: NextRequest) {
    const token = req.headers.get('authorization');
    const form = await req.formData();

    try {
        const { data } = await axios.post(nextConfig.env?.API_URL + `api/posts`, form, {
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

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId")
    const token = req.headers.get('authorization');

    try {
        const { data } = await axios.delete(nextConfig.env?.API_URL + `api/posts/${postId}`, {
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