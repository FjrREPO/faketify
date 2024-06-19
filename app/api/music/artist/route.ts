import { NextResponse } from "next/server"

import prisma from "@/lib/prisma/prisma"
export async function POST(
    request: Request,
) {
    const body = await request.json()
    const {
        artist_name,
        artist_popularity,
        artist_followers,
        artist_images,
        artist_genres,
        artist_saved_id
    } = body

    const artist = await prisma.artist.create({
        data: {
            artist_name,
            artist_popularity,
            artist_followers,
            artist_images,
            artist_genres,
            artist_saved_id
        },
    })

    return NextResponse.json(artist)
}

export async function GET(
    request: Request
) {
    const artists = await prisma.artist.findMany({})

    return NextResponse.json(artists)
}