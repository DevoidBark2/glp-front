import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import nextConfig from "../../../../next.config.mjs";

export async function GET(req: NextRequest) {
    const token = req.headers.get('authorization');
    try {
        const { data } = await axios.get(nextConfig.env?.API_URL + 'api/component-task', {
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


export async function POST(req: NextRequest) {
    const token = req.headers.get('authorization');
    const body = await req.json();

    try {
        const { data } = await axios.post(nextConfig.env?.API_URL + `api/component-task`, body, {
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
    const body = await req.json();

    try {
        const { data } = await axios.put(nextConfig.env?.API_URL + `api/component-task`, body, {
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
    const componentId = searchParams.get('componentId');

    const token = searchParams.get('token');

    try {
        const response = await axios.delete(nextConfig.env?.API_URL + `api/component-task/${componentId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const responseData = response.data;
        return NextResponse.json({ response: responseData });
    } catch (error: any) {
        console.error(error)
        return NextResponse.json(error.response.data, { status: error.response.status })
    }
}