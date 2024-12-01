'use client'

import { Artist } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import React from 'react'

export default function CategoryDetailsArtists({ savedId }: { savedId: string }) {
    const artists = useQuery<Artist[]>({
        queryKey: ["artist"],
        queryFn: () => fetch(`/api/music/artist`).then(res => res.json()),
    })

    const findArtistById = artists.data?.find(artist => artist.artist_saved_id === savedId)

    return (
        <motion.div
            className="flex flex-col pt-2 min-w-[200px] h-auto justify-between duration-200 cursor-pointer"
            transition={{
                ease: "linear",
                duration: 2,
                x: { duration: 1 }
            }}
        >
            <div className="flex flex-col items-center gap-2">
                <div className="relative">
                    <motion.img
                        src={findArtistById?.artist_images[0] || 'https://res.cloudinary.com/dutlw7bko/image/upload/v1718969701/faketify/placeholder-img_wbhjm1.png'}
                        className="rounded-lg w-[180px] h-[180px]"
                        alt="image"
                        whileHover={{ scale: 1.05 }}
                    />
                </div>
                <span className="max-w-[200px] line-clamp-2">{findArtistById?.artist_name || ''}</span>
            </div>
        </motion.div>
    )
}
