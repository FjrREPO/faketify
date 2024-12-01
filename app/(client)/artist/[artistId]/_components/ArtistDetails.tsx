'use client'

import MusicPlayButton from "@/components/music/music-play-button";
import { Label } from "@/components/ui/label";
import { Album, Artist, Category, Track } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { FastAverageColor } from "fast-average-color";
import { useState, useEffect } from "react";
import { GoPlusCircle } from "react-icons/go";
import { BsThreeDots } from "react-icons/bs";
import ArtistRecommendCard from "./ArtistRecommendCard";

export default function ArtistDetails({ artistId }: { artistId: string }) {
    const tracks = useQuery<Track[]>({
        queryKey: ["tracks"],
        queryFn: () => fetch(`/api/music/track`).then((res) => res.json()),
    });

    const albums = useQuery<Album[]>({
        queryKey: ["albums"],
        queryFn: () => fetch(`/api/music/album`).then((res) => res.json()),
    });

    const artists = useQuery<Artist[]>({
        queryKey: ["artists"],
        queryFn: () => fetch(`/api/music/artist`).then((res) => res.json()),
    });

    const categories = useQuery<Category[]>({
        queryKey: ["category"],
        queryFn: () => fetch(`/api/category`).then((res) => res.json()),
    });

    const findArtistById = artists.data?.find((artist) => artist.artist_id === artistId);
    const findArtistBySavedId = artists.data?.find((artist) => artist.artist_saved_id === artistId);
    const findAlbumByTrackId = albums.data?.find((album) => album.album_tracks_id.includes(findArtistById?.artist_saved_id ?? ''));
    const findTrackByArtistId = tracks.data?.find((track) => track.track_artists_id.includes(findArtistById?.artist_saved_id ?? ''));
    const findCategoryByTrackId = categories.data?.find((category) => category.category_tracks_id.includes(findArtistById?.artist_saved_id ?? ''));

    const imageUrl = `${findArtistById?.artist_images[0]}`;

    const [color, setColor] = useState<{ hex: string } | null>(null);

    useEffect(() => {
        const extractColor = async () => {
            try {
                if (!imageUrl) {
                    throw new Error('No image URL provided');
                }

                const fac = new FastAverageColor();
                const result = await fac.getColorAsync(imageUrl);
                setColor(result);
            } catch (error) {
                console.error('Error extracting color:', error);
            }
        };

        extractColor();
    }, [imageUrl]);

    if (!color) {
        return null;
    }

    const duration = findTrackByArtistId?.track_duration_ms ?? '';
    const date = new Date(duration);

    return (
        <div
            className={`mt-[-120px] pt-[120px] w-full h-full gap-5 flex flex-col`}
            style={{ background: `linear-gradient(180deg, ${color.hex} 40%, black 100%)` }}
        >
            <div className="flex flex-col pl-5 pt-[90px]">
                <div className="flex flex-row gap-5">
                    <img
                        src={imageUrl}
                        alt="Album Cover"
                        className="w-[200px] rounded-sm bg-none shadow-xl"
                    />
                    <div className="flex flex-col gap-3 justify-end">
                        <Label className="capitalize">{findCategoryByTrackId?.category_type}</Label>
                        <Label className="text-5xl font-black capitalize">{findArtistById?.artist_name}</Label>
                        <div className="flex flex-row items-center gap-2">
                            <img src={findArtistById?.artist_images[0]} alt="" className="w-7 h-7 rounded-full" />
                            <Label className="text-lg">{findArtistById?.artist_name}{" | "}</Label>
                            <Label>{`${date.getMinutes()}:${date.getSeconds()}`}{" | "}</Label>
                            <Label>{findArtistById?.artist_followers || ''}{" "}Followers</Label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col bg-black/20 w-full h-auto p-5 gap-[80px]">
                <div className="flex flex-row items-center gap-7">
                    <MusicPlayButton track={findTrackByArtistId!} />
                    <GoPlusCircle className="w-8 h-8 text-textsecondary" />
                    <BsThreeDots className="w-8 h-8 text-textsecondary" />
                </div>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col">
                        <Label className="text-2xl font-black">Recommended</Label>
                        <Label className="text-sm text-textsecondary">Based on this song</Label>
                    </div>
                    <ArtistRecommendCard tracksData={tracks.data!} albumsData={albums.data!} artistsData={artists.data!} findArtistById={findArtistById!} />
                </div>
            </div>
        </div>
    );
}
