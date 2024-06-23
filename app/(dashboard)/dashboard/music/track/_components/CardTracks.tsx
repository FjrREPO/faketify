"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Images, Pencil, Plus, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import SkeletonWrapper from "@/components/loader/skeleton-wrapper";
import CreateTrackDialog from "./CreateTrackDialog";
import { Album, Artist, Track } from "@prisma/client";
import DeleteTrackDialog from "../../track/_components/DeleteTrackDialog";
import Image from "next/image";
import EditTrackDialog from "../../track/_components/EditTrackDialog";
import MusicPlayer from "@/components/music/music-player";
import { FaPlayCircle } from "react-icons/fa";
import { useMusicPlayer } from "@/components/providers/music-provider";

export default function CardTracks() {
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
    const { setCurrentTrack } = useMusicPlayer();

    const tracks = useQuery({
        queryKey: ["track"],
        queryFn: () =>
            fetch(`/api/music/track`).then((res) => res.json()),
    });

    const handleTrackSelect = (track: Track) => {
        setCurrentTrack(track);
    };

    return (
        <>
            <div className="border-b bg-card">
                <div className="container flex flex-wrap items-center justify-between md:flex-nowrap gap-6 py-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold">Manage Track</h2>
                        <p>
                            Manage your tracks data such create and delete track.
                        </p>
                    </div>
                </div>
            </div>
            <div className="container flex flex-col gap-4 p-4">
                <CardList tracks={tracks} onTrackSelect={handleTrackSelect} />
            </div>
        </>
    );
}

function CardList({ tracks, onTrackSelect }: { tracks: any, onTrackSelect: (track: Track) => void }) {
    const album = useQuery<Album[]>({
        queryKey: ["album"],
        queryFn: () =>
            fetch(`/api/music/album`).then((res) => res.json()),
    });

    const artist = useQuery<Artist[]>({
        queryKey: ["artist"],
        queryFn: () =>
            fetch(`/api/music/artist`).then((res) => res.json()),
    });

    const dataAvailable = tracks.data && tracks.data.length > 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Images className="h-12 w-12 items-center rounded-xl p-2" />
                        <span>Track</span>
                    </div>
                    <CreateTrackDialog
                        trigger={
                            <Button className="gap-2 text-sm flex flex-row items-center">
                                <Plus className="h-6 w-6" />
                                <span>Add Track</span>
                            </Button>
                        }
                    />
                </CardTitle>
            </CardHeader>
            <Separator />
            {!dataAvailable && (
                <div className="flex h-40 w-full flex-col items-center justify-center">
                    <p>
                        Track not found{" "}
                        <span
                            className={cn(
                                "m-1",
                                "text-green-500"
                            )}
                        >
                            {"Track"}
                        </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                        You can add track.
                    </p>
                </div>
            )}
            {dataAvailable && (
                <div className="flex flex-row flex-wrap gap-4 p-4">
                    <SkeletonWrapper isLoading={tracks.isLoading}>
                        {tracks.data.map((track: any) => {
                            const filteredAlbum = album.data && track.track_albums_id.length > 0 &&
                                album.data.find((item: any) => track.track_albums_id.includes(item.album_saved_id));
                            const filteredArtist = artist.data && track.track_artists_id.length > 0 &&
                                artist.data.find((item: any) => track.track_artists_id.includes(item.artist_saved_id));
                            return (
                                <CardTrack
                                    key={track.track_id}
                                    track={track}
                                    filteredArtist={filteredArtist}
                                    filteredAlbum={filteredAlbum}
                                    onTrackSelect={onTrackSelect}
                                />
                            )
                        })}
                    </SkeletonWrapper>
                </div>
            )}
        </Card>
    );
}

function CardTrack({ track, filteredArtist, filteredAlbum, onTrackSelect }: { track: Track, filteredArtist: any, filteredAlbum: any, onTrackSelect: (track: Track) => void }) {
    if (!filteredAlbum) return null;
    return (
        <div className="flex border-separate flex-col px-2 pb-2 justify-between rounded-lg border shadow-sm shadow-black/[0.1] dark:shadow-white/[0.1]">
            <div className="flex flex-col items-center gap-2 p-4">
                <span className="max-w-[200px] line-clamp-2">{filteredArtist && filteredArtist.artist_name}</span>
                <span className="max-w-[200px] line-clamp-2">{track.track_name}</span>
                <Image src={filteredAlbum.album_images[0]} alt="image" width={100} height={100} className="rounded-lg" />
            </div>
            <div className="w-full flex flex-row gap-2">
                <Button onClick={() => onTrackSelect(track)} className="w-1/3 bg-green-500 hover:bg-green-600 text-white">
                    <FaPlayCircle />
                </Button>
                <DeleteTrackDialog
                    track={track}
                    trigger={<Button variant="destructive" className="w-1/3"><Trash className="h-4 w-4" /></Button>}
                />
                <EditTrackDialog
                    track={track}
                    trigger={<Button className="w-1/3 bg-blue-500 hover:bg-blue-600 text-white"><Pencil className="h-4 w-4" /></Button>}
                />
            </div>
        </div>
    );
}
