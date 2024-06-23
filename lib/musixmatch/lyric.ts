export async function getLyricMusixmatch(title: string, artist: string) {
    const response = await fetch(`https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${encodeURIComponent(title)}&q_artist=${encodeURIComponent(artist)}&apikey=091f1a8a1e31a6ea10719e25eba6069b`);
    if (!response.ok) {
        throw new Error('Failed to fetch lyrics');
    }
    const data = await response.json();
    return data.message.body.lyrics.lyrics_body;
}
