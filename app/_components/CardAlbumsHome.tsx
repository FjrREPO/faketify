import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { FaPlayCircle } from "react-icons/fa";

export function CardAlbumsHome({ label, image }: { label: string; image: string }) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <motion.div
            className="flex flex-col min-w-[200px] justify-between rounded-lg duration-200 cursor-pointer hover:bg-white/10 p-2"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <div className="flex flex-col items-center gap-2">
                <div className="relative">
                    <Image
                        src={image || 'https://res.cloudinary.com/dutlw7bko/image/upload/v1718969701/faketify/placeholder-img_wbhjm1.png'}
                        className="rounded-lg w-[180px] h-[180px]"
                        alt="image"
                        width={180}
                        height={180}
                    />
                </div>
                <span className="max-w-[200px] line-clamp-2">{label || ''}</span>
            </div>
        </motion.div>
    );
}