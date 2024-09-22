import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';
import nextConfig from "../../../../next.config.mjs";

export async function POST(req: NextRequest) {
    const form = await req.formData();
    const token = req.headers.get('authorization');

    try {
        const {data} = await axios.post(nextConfig.env?.API_URL + 'api/send-feedback', form, {
            headers: {
                Authorization: token,
                'Content-Type': 'multipart/form-data',
            }
        });

        return NextResponse.json({...data});
    } catch (error: any) {
        console.error(error)
        return NextResponse.json(error.response.data,{status:error.response.status})
    }
}
