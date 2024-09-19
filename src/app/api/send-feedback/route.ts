import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';
import nextConfig from "../../../../next.config.mjs";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const token = req.headers.get('authorization');

    try {
        const {data} = await axios.post(nextConfig.env?.API_URL + 'api/send-feedback', body, {
            headers: {
                Authorization: token
            }
        });

        return NextResponse.json({...data});
    } catch (error: any) {
        console.error(error)
        return NextResponse.json(error.response.data,{status:error.response.status})
    }
}
