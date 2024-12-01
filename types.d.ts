type UserRole = "USER" | "ADMIN";

interface SpotifyContextType {
    token?: string | null;
    loading?: boolean;
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
    error?: string | null;
    setError?: React.Dispatch<React.SetStateAction<string | null>>;
}

interface ArtistData {
    name: string;
    popularity: number;
    release_date: string;
    images: { url: string }[];
    tracks: { items: { id: string }[] };
    artists: { id: string }[];
    followers: { total: number };
    genres: string[];
    id: string;
}