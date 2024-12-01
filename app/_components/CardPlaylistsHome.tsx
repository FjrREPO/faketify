import MusicPlayButton from "@/components/music/music-play-button";
import { Playlist, Track } from "@prisma/client";
import { motion } from "framer-motion";
import { useState } from "react";

export function CardPlaylistsHome({ label, image, trackData, playlist }: { label: string; image: string, trackData: Track[], playlist: Playlist }) {
    const [isHovered, setIsHovered] = useState(false);
    const findTrack = trackData?.find(track => track.track_saved_id?.includes(playlist?.playlist_tracks_id[0]));
    
    return (
        <motion.div
            className="flex flex-col min-w-[200px] justify-between rounded-lg duration-200 cursor-pointer hover:bg-white/10 p-2"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <div className="flex flex-col items-center gap-2">
                <div className="relative">
                    <img
                        src={image || 'https://res.cloudinary.com/dutlw7bko/image/upload/v1718969701/faketify/placeholder-img_wbhjm1.png'}
                        className="rounded-lg w-[180px] h-[180px]"
                        alt="image"
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
                        <MusicPlayButton track={findTrack!} />
                    </motion.div>
                </div>
                <span className="max-w-[200px] line-clamp-2">{label || ''}</span>
            </div>
        </motion.div>
    );
}