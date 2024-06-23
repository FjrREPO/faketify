import { NextResponse } from "next/server"

import prisma from "@/lib/prisma/prisma"
export async function POST(
    request: Request,
) {
    const body = await request.json()
    const {
        playlist_name,
        playlist_description,
        playlist_followers,
        playlist_images,
        playlist_tracks_id,
        playlist_albums_id,
        playlist_artists_id,
        playlist_saved_id
    } = body

    const playlist = await prisma.playlist.create({
        data: {
            playlist_name,
            playlist_description,
            playlist_followers,
            playlist_images,
            playlist_tracks_id,
            playlist_albums_id,
            playlist_artists_id,
            playlist_saved_id
        },
    })

    return NextResponse.json(playlist)
}

export async function GET(
    request: Request
) {
    const playlists = await prisma.playlist.findMany({})

    return NextResponse.json(playlists)
}