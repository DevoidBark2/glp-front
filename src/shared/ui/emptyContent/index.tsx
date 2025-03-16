import { FC } from "react";
import Image from "next/image";

interface EmptyContentProps {
    image: string;
    title?: string;
    description?: string
}

export const EmptyContent: FC<EmptyContentProps> = ({image, title, description}) => (
        <div className="text-center py-10 flex flex-col items-center">
            <Image
                src={image}
                alt="Empty icon"
                width={150}
                height={150}
            />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600">{description}</p>
        </div>
    )