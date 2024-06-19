import { NextResponse } from "next/server"

import prisma from "@/lib/prisma/prisma"
export async function POST(
    request: Request,
) {
    const body = await request.json()
    const {
        album_name,
        album_popularity,
        album_release_date,
        album_images,
        album_tracks_id,
        album_artists_id
    } = body

    const album = await prisma.album.create({
        data: {
            album_name,
            album_popularity,
            album_release_date,
            album_images,
            album_tracks_id,
            album_artists_id
        },
    })

    return NextResponse.json(album)
}

export async function GET(
    request: Request
) {
    const albums = await prisma.album.findMany({})

    return NextResponse.json(albums)
}