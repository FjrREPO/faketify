import prisma from "@/lib/prisma/prisma";
import { NextResponse } from "next/server";

interface Params {
    params: Promise<{ albumId: string }>;
}

export async function PUT(
    request: Request,
    { params }: Params
) {
    const { albumId } = await params;
    const body = await request.json();
    const {
        album_name,
        album_popularity,
        album_release_date,
        album_images,
        album_tracks_id,
        album_artists_id
    } = body;

    const album = await prisma.album.update({
        where: { album_id: albumId },
        data: {
            album_name,
            album_popularity,
            album_release_date,
            album_images,
            album_tracks_id,
            album_artists_id
        },
    });

    return NextResponse.json(album);
}

export async function DELETE(
    request: Request,
    { params }: Params
) {
    const { albumId } = await params;
    const album = await prisma.album.delete({
        where: { album_id: albumId },
    });
    return NextResponse.json(album);
}