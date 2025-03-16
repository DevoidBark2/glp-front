import Image from "next/image"
import {
    FileOutlined
} from "@ant-design/icons";

import { useMobxStores } from "@/shared/store/RootStore";

export const FileAttachment = () => {
    const { courseStore } = useMobxStores()

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();

        switch (extension) {
            case 'pdf':
                return <Image src="/static/pdf-icon.svg" alt={extension} width={30} height={30} />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'svg':
            case 'webp':
                return <Image src="/static/png_icon.svg" alt={extension} width={30} height={30} />;
            case 'doc':
            case 'docx':
                return <Image src="/static/word-icon.svg" alt={extension} width={30} height={30} />;
            case 'xlsx':
            case 'xls':
                return <Image src="/static/excel-icon.svg" alt={extension} width={30} height={30} />;
            default:
                return <FileOutlined className="text-gray-400" />;
        }
    };

    return (
        // courseStore.fullDetailCourse?.files && courseStore.fullDetailCourse?.files.length > 0 && <div className="mt-6">
        //     <h2 className="text-2xl font-extrabold mb-6 text-gray-900">📂 Дополнительный материал</h2>
        //     <div className="space-y-4">
        //         {(courseStore.fullDetailCourse?.files || []).map((file, index) => (
        //             <div
        //                 key={index}
        //                 className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
        //             >
        //                 <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500">
        //                     {getFileIcon(file.fileName)}
        //                 </div>
        //                 <Link
        //                     href={`${nextConfig.env?.API_URL}${file.filePath}`}
        //                     download
        //                     className="ml-4 text-gray-800 font-medium text-sm hover:text-blue-500 transition-colors truncate"
        //                 >
        //                     {file.fileName}
        //                 </Link>
        //             </div>
        //         ))}
        //     </div>
        // </div>
        <div></div>
    )
}