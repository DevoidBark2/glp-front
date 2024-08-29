import {NextRequest, NextResponse} from "next/server";
import axios from "axios";
import nextConfig from "../../../../next.config.mjs";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    try {
        const response = await axios.get(nextConfig.env?.API_URL + 'api/sections',{
            headers: {
                Authorization: token
            }
        });

        const responseData = response.data;
        return NextResponse.json({ response: responseData });
    } catch (error: any) {
        console.error(error)
        return NextResponse.json(error.response.data,{status:error.response.status})
    }
}

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    const body = await req.json();

    try {
        const response = await axios.post(nextConfig.env?.API_URL + 'api/sections',body,{
            headers: {
                Authorization: token
            }
        });

        const responseData = response.data;
        return NextResponse.json({ response: responseData });
    } catch (error: any) {
        console.error(error)
        return NextResponse.json(error.response.data,{status:error.response.status})
    }
}