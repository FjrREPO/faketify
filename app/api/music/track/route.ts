import { NextResponse } from "next/server"

import prisma from "@/lib/prisma/prisma"

export async function POST(
    request: Request,
) {
    const body = await request.json()
    const {
        track_name,
        track_popularity,
        track_duration_ms,
        track_file,
        track_albums_id,
        track_artists_id,
        track_saved_id
    } = body

    try {
        const track = await prisma.track.create({
            data: {
                track_name,
                track_popularity,
                track_duration_ms,
                track_file,
                track_albums_id,
                track_artists_id,
                track_saved_id
            },
        });
        return NextResponse.json(track);
    } catch (error) {
        console.error("Error creating track:", error);
        return NextResponse.error();
    }
}

export async function GET(
    request: Request
) {
    const tracks = await prisma.track.findMany({})

    return NextResponse.json(tracks)
}