import MusicPlayButton from "@/components/music/music-play-button";
import { Track } from "@prisma/client";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function CardTracksHome({ label, image, id, track }: { label: string; image: string, id: string, track: Track }) {
    const [isHovered, setIsHovered] = useState(false);

    const handleButtonClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
    };

    return (
        <motion.a
            className="flex flex-col min-w-[200px] justify-between rounded-lg duration-200 cursor-pointer hover:bg-white/10 p-2"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            href={`/track/${id}`}
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
                    <motion.div
                        className="absolute right-2 bottom-2"
                        whileHover={{
                            translateY: 0,
                            opacity: 1,
                        }}
                        animate={{
                            opacity: isHovered ? 1 : 0,
                            translateY: isHovered ? 0 : '8px',
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        <div onClick={handleButtonClick}>
                            <MusicPlayButton track={track}/>
                        </div>
                    </motion.div>
                </div>
                <span className="max-w-[200px] line-clamp-2">{label || ''}</span>
            </div>
        </motion.a>
    );
}