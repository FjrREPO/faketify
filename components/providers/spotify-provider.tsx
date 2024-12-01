'use client'

import { getTokenSpotify } from "@/lib/spotify/token/get-token-spotify";
import { useState, useEffect, createContext } from "react";

export const SpotifyContext = createContext<SpotifyContextType>({});

export const SpotifyProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchToken = async () => {
        setLoading(true);
        try {
            const fetchedToken = await getTokenSpotify();
            setToken(fetchedToken);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch token');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchToken();
    }, []);

    return (
        <SpotifyContext.Provider value={{ token, loading, setLoading, error, setError }}>
            {children}
        </SpotifyContext.Provider>
    );
};
