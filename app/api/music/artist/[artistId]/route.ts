import prisma from "@/lib/prisma/prisma";
import { NextResponse } from "next/server";

export async function PUT(
    request: Request,
    context: { params: Promise<{ artistId: string }> }
) {
    const { params } = context;
    const { artistId } = await params;
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
        where: { artist_id: artistId },
        data: {
            artist_name,
            artist_popularity,
            artist_followers,
            artist_images,
            artist_genres,
            artist_saved_id
        }
    });

    return NextResponse.json(artist);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ artistId: string }> }
) {
    const { artistId } = await params;
    const artist = await prisma.artist.delete({
        where: { artist_id: artistId },
    });
    return NextResponse.json(artist);
}