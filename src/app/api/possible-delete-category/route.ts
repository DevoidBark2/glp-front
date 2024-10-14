import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import nextConfig from "../../../../next.config.mjs";

export async function POST(req: NextRequest) {
    const token = req.headers.get('authorization');
    const data = await req.json();

    try {
        const response = await axios.post(nextConfig.env?.API_URL + 'api/possible-delete-category', data, {
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
