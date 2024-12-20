import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const artist = searchParams.get('artist');
    const title = searchParams.get('title');

    if (!title || !artist) {
        return NextResponse.json({ error: 'Missing artist or title parameter' }, { status: 400 });
    }

    const url = `https://api.lyrics.ovh/v1/${artist}/${title}`;

    const response = await fetch(url);
    
    if (!response.ok) {
        return NextResponse.json({ error: 'Failed to fetch lyrics' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
}
