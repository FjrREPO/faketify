import prisma from "@/lib/prisma/prisma";
import { NextResponse } from "next/server";

export async function PUT(
    request: Request,
    { params }: { params: { artistId: string } }
) {
    const body = await request.json();
    const {
        artist_name,
        artist_popularity,
        artist_followers,
        artist_images,
        artist_genres,
        artist_saved_id
    } = body;

    const artist = await prisma.artist.update({
        where: { artist_id: params.artistId },
        data: {
            artist_name,
            artist_popularity,
            artist_followers,
            artist_images,
            artist_genres,
            artist_saved_id
        },
    });

    return NextResponse.json(artist);
}

export async function DELETE(
    request: Request,
    { params }: { params: { artistId: string } }
) {
    const artist = await prisma.artist.delete({
        where: { artist_id: params.artistId },
    });
    return NextResponse.json(artist);
}