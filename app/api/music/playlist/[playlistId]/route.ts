import prisma from "@/lib/prisma/prisma";
import { NextResponse } from "next/server";

export async function PUT(
    request: Request,
    { params }: { params: { playlistId: string } }
) {
    const body = await request.json();
    const {
        playlist_name,
        playlist_description,
        playlist_followers,
        playlist_images,
        playlist_tracks_id,
        playlist_albums_id,
        playlist_artists_id,
        playlist_saved_id
    } = body;

    const playlist = await prisma.playlist.update({
        where: { playlist_id: params.playlistId },
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
    });

    return NextResponse.json(playlist);
}

export async function DELETE(
    request: Request,
    { params }: { params: { playlistId: string } }
) {
    const playlist = await prisma.playlist.delete({
        where: { playlist_id: params.playlistId },
    });
    return NextResponse.json(playlist);
}