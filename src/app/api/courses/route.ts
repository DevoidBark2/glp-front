import axios from "axios";
import nextConfig from "../../../../next.config.mjs";
import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest) {
    try {
        const response = await axios.get(nextConfig.env?.API_URL + 'api/get-all-courses');

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

    const form = await req.formData();

    try {
        const response = await axios.post(nextConfig.env?.API_URL + `api/create-course`,form,{
            headers: {
                'Content-Type': 'multipart/form-data',
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