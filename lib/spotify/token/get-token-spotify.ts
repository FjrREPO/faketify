export const getTokenSpotify = async (): Promise<string | null> => {
    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + btoa("555652838c8d4cc8a026a5ad59debb9f:4b16df1f20094a4f94c9b166f34eb8bd"),
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch token");
        }

        const jsonData = await response.json();
        return jsonData.access_token;
    } catch (error) {
        console.error("Token fetch error:", error);
        return null;
    }
};
