'use client'

import { Album, Artist, Category, Playlist, Track } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import CategoryDetailsArtists from './CategoryDetailsArtists'
import CategoryDetailsAlbums from './CategoryDetailsAlbums'
import CategoryDetailsPlaylists from './CategoryDetailsPlaylists'
import { Label } from '@/components/ui/label'
import { CategoryDetailsTracks } from './CategoryDetailsTracks'

export default function CategoryDetails({ categoryId }: { categoryId: string }) {
    const categories = useQuery<Category[]>({
        queryKey: ["category"],
        queryFn: () => fetch(`/api/category`).then(res => res.json()),
    })

    const findCategoryById = categories.data?.find(category => category.category_id === categoryId)

    return (
        <div className="flex flex-col gap-10 pl-10 pt-5">
            <Label className='text-3xl'>{findCategoryById?.category_name}</Label>
            <div className="flex flex-row flex-wrap gap-4">
                {findCategoryById?.category_type == 'artists' && findCategoryById &&
                    findCategoryById.category_artists_saved_id.map((cat: string) => (
                        <div key={cat}>
                            <CategoryDetailsArtists savedId={cat as string} />
                        </div>
                    ))
                }

                {findCategoryById?.category_type == 'albums' && findCategoryById &&
                    findCategoryById.category_albums_saved_id.map((cat: string) => (
                        <div key={cat}>
                            <CategoryDetailsAlbums savedId={cat as string} />
                        </div>
                    ))
                }

                {findCategoryById?.category_type == 'tracks' && findCategoryById &&
                    findCategoryById.category_tracks_saved_id.map((cat: string) => (
                        <div key={cat}>
                            <CategoryDetailsTracks savedId={cat as string} />
                        </div>
                    ))
                }

                {findCategoryById?.category_type == 'playlists' && findCategoryById &&
                    findCategoryById.category_playlists_saved_id.map((cat: string) => (
                        <div key={cat}>
                            <CategoryDetailsPlaylists savedId={cat as string} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
