import {NextRequest, NextResponse} from "next/server";
import axios from "axios";
import nextConfig from "../../../../next.config.mjs";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    try {
        const response = await axios.get(nextConfig.env?.API_URL + `api/course-details/${courseId}`);

        const responseData = response.data;
        return NextResponse.json({ response: responseData });
    } catch (error: any) {
        console.error(error)
        return NextResponse.json(error.response.data,{status:error.response.status})
    }
}