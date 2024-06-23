"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode, useState } from "react";
import { ThemeProvider } from "./theme-provider";
import { SpotifyProvider } from "./spotify-provider";
import { MusicPlayerProvider } from "./music-provider";

interface Props {
    children: ReactNode;
}

const Providers = (props: Props) => {
    const [client] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                    },
                },
            })
    );
    return (
        <SpotifyProvider>
            <QueryClientProvider client={client}>
                <MusicPlayerProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {props.children}
                    </ThemeProvider>
                </MusicPlayerProvider>
            </QueryClientProvider>
        </SpotifyProvider>
    )
};

export default Providers;
