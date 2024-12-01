'use client'

import { Playlist } from '@prisma/client'
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import image from 'next/image';
import React, { useState } from 'react'
import { FaPlayCircle } from 'react-icons/fa';

export default function CategoryDetailsPlaylists({ savedId }: { savedId: string }) {
    const playlists = useQuery<Playlist[]>({
        queryKey: ["playlist"],
        queryFn: () => fetch(`/api/playlist`).then(res => res.json()),
    })

    const findPlaylistById = playlists.data?.find(playlist => playlist.playlist_saved_id === savedId)

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
                        src={findPlaylistById?.playlist_images[0] || 'https://res.cloudinary.com/dutlw7bko/image/upload/v1718969701/faketify/placeholder-img_wbhjm1.png'}
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
                        <FaPlayCircle className="text-[50px] text-green-500/95 hover:text-green-500 hover:scale-105 duration-100" />
                    </motion.div>
                </div>
                <span className="max-w-[200px] line-clamp-2">{findPlaylistById?.playlist_name || ''}</span>
            </div>
        </motion.div>
    );
}
