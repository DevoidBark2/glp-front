import { NextApiRequest, NextApiResponse } from "next";
import { axiosInstance } from "@/shared/api/http-client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { data } = await axiosInstance.get(`api/general-settings`);

        res.status(200).json(data);
    } catch (error: any) {
        console.error("Ошибка запроса:", error);
        res.status(error.response?.status || 500).json({ error: "Ошибка получения данных" });
    }
}
