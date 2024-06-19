
export const getArtistByIdSpotify = async (id: string, token: string): Promise<any[]> => {
    try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Spotify data");
        }

        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error("Spotify data fetch error:", error);
        return [];
    }
};
