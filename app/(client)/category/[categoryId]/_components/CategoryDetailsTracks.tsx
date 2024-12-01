'use client'

import MusicPlayButton from '@/components/music/music-play-button'
import { Album, Track } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Image from 'next/image'
import image from 'next/image'
import React, { useState } from 'react'
import { FaPlayCircle } from 'react-icons/fa'

export const CategoryDetailsTracks = ({ savedId }: { savedId: string }) => {
    const tracks = useQuery<Track[]>({
        queryKey: ["track"],
        queryFn: () => fetch(`/api/music/track`).then(res => res.json()),
    })

    const albums = useQuery<Album[]>({
        queryKey: ["album"],
        queryFn: () => fetch(`/api/music/album`).then(res => res.json()),
    })

    const findTrackById = tracks.data?.find(track => track.track_saved_id === savedId)
    const findAlbumByTrackId = albums.data?.find(album => album.album_saved_id === findTrackById?.track_albums_id)

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
                        src={findAlbumByTrackId?.album_images[0] || 'https://res.cloudinary.com/dutlw7bko/image/upload/v1718969701/faketify/placeholder-img_wbhjm1.png'}
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
                        <MusicPlayButton track={findTrackById!} />
                    </motion.div>
                </div>
                <span className="max-w-[200px] line-clamp-2">{findTrackById?.track_name || ''}</span>
            </div>
        </motion.div>
    );
}
