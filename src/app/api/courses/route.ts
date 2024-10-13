import axios from "axios";
import nextConfig from "../../../../next.config.mjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const response = await axios.get(nextConfig.env?.API_URL + 'api/courses');

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
        const { data } = await axios.post(nextConfig.env?.API_URL + `api/course`, form, {
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

export async function PUT(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    const reqBody = await req.json();

    try {
        const { data } = await axios.put(nextConfig.env?.API_URL + `api/course`, reqBody, {
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

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const token = req.headers.get('authorization');

    try {
        const { data } = await axios.delete(nextConfig.env?.API_URL + `api/course/${courseId}`, {
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