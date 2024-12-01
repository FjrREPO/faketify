import prisma from "@/lib/prisma/prisma";
import { NextResponse } from "next/server";

interface Params {
    params: Promise<{ categoryId: string }>;
}

export async function PUT(
    request: Request,
    { params }: Params
) {
    const { categoryId } = await params;
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
        where: { category_id: categoryId },
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
    { params }: Params
) {
    const { categoryId } = await params;
    const category = await prisma.category.delete({
        where: { category_id: categoryId },
    });
    return NextResponse.json(category);
}