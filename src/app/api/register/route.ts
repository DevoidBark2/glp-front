import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';
import nextConfig from "../../../../next.config.mjs";

export async function POST(req: NextRequest) {
    const { reqBody } = await req.json();

    try {
        const response = await axios.post(nextConfig.env?.API_URL + 'api/register', reqBody);

        const responseData = response.data;
        return NextResponse.json({ response: responseData });
    } catch (error: any) {
        console.error(error)
        return NextResponse.json(error.response.data,{status:error.response.status})
    }
}
