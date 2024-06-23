import prisma from "@/lib/prisma/prisma";
import { NextResponse } from "next/server";

export async function PUT(
    request: Request,
    { params }: { params: { categoryId: string } }
) {
    const body = await request.json();
    const {
        category_name,
        category_type,
        category_artists_id,
        category_albums_id,
        category_tracks_id,
        category_playlists_id,
        category_artists_saved_id,
        category_albums_saved_id,
        category_tracks_saved_id,
        category_playlists_saved_id
    } = body;

    const category = await prisma.category.update({
        where: { category_id: params.categoryId },
        data: {
            category_name,
            category_type,
            category_artists_id,
            category_albums_id,
            category_tracks_id,
            category_playlists_id,
            category_artists_saved_id,
            category_albums_saved_id,
            category_tracks_saved_id,
            category_playlists_saved_id
        },
    });

    return NextResponse.json(category);
}

export async function DELETE(
    request: Request,
    { params }: { params: { categoryId: string } }
) {
    const category = await prisma.category.delete({
        where: { category_id: params.categoryId },
    });
    return NextResponse.json(category);
}