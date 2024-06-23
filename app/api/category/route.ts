import prisma from "@/lib/prisma/prisma"
import { NextResponse } from "next/server"

export async function POST(
    request: Request
) {
    const body = await request.json()
    const {
        category_name,
        category_type,
        category_artists_id,
        category_albums_id,
        category_tracks_id,
        category_artists_saved_id,
        category_albums_saved_id,
        category_tracks_saved_id
    } = body

    const category = await prisma.category.create({
        data: {
            category_name,
            category_type,
            category_artists_id,
            category_albums_id,
            category_tracks_id,
            category_artists_saved_id,
            category_albums_saved_id,
            category_tracks_saved_id
        },
    })
    
    return NextResponse.json(category)
}

export async function GET(
    request: Request
) {
    const categories = await prisma.category.findMany({})

    return NextResponse.json(categories)
}