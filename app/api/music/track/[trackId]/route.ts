import prisma from "@/lib/prisma/prisma";
import { NextResponse } from "next/server";

export async function PUT(
    request: Request,
    { params }: { params: { trackId: string } }
) {
    const body = await request.json();
    const {
        track_name,
        track_popularity,
        track_duration_ms,
        track_file,
        track_albums_id,
        track_artists_id
    } = body;

    const track = await prisma.track.update({
        where: { track_id: params.trackId },
        data: {
            track_name,
            track_popularity,
            track_duration_ms,
            track_file,
            track_albums_id,
            track_artists_id
        },
    });

    return NextResponse.json(track);
}

export async function DELETE(
    request: Request,
    { params }: { params: { trackId: string } }
) {
    const track = await prisma.track.delete({
        where: { track_id: params.trackId },
    });
    return NextResponse.json(track);
}