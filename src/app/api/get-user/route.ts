import axios from "axios";
import nextConfig from "../../../../next.config.mjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = req.headers.get('authorization');

    try {
        const { data } = await axios.get(nextConfig.env?.API_URL + 'api/profile-user', {
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
