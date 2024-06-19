"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Plus, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import SkeletonWrapper from "@/components/loader/skeleton-wrapper";
import CreateArtistDialog from "./CreateArtistDialog";
import { Artist } from "@prisma/client";
import DeleteArtistDialog from "./DeleteArtistDialog";
import Image from "next/image";
import { BsPersonBadge } from "react-icons/bs";
import EditArtistDialog from "./EditArtistDialog";

export default function CardArtists() {
    return (
        <>
            <div className="border-b bg-card">
                <div className="container flex flex-wrap items-center justify-between md:flex-nowrap gap-6 py-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold">Manage Artist</h2>
                        <p>
                            Manage your artists data such create and delete artist.
                        </p>
                    </div>
                </div>
            </div>
            <div className="container flex flex-col gap-4 p-4">
                <CategoryList />
            </div>
        </>
    );
}

function CategoryList() {
    const artists = useQuery({
        queryKey: ["artist"],
        queryFn: () =>
            fetch(`/api/music/artist`).then((res) => res.json()),
    });

    const dataAvailable = artists.data && artists.data.length > 0;

    return (
        <SkeletonWrapper isLoading={artists.isLoading}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <BsPersonBadge className="h-12 w-12 items-center rounded-xl p-2" />
                            <span>
                                Artist
                            </span>
                        </div>

                        <CreateArtistDialog
                            trigger={
                                <Button className="gap-2 text-sm flex flex-row items-center">
                                    <Plus className="h-6 w-6" />
                                    <span>Add Artist</span>
                                </Button>
                            }
                        />
                    </CardTitle>
                </CardHeader>
                <Separator />
                {!dataAvailable && (
                    <div className="flex h-40 w-full flex-col items-center justify-center">
                        <p>
                            Artist not found{" "}
                            <span
                                className={cn(
                                    "m-1",
                                    "text-green-500"
                                )}
                            >
                                {"Artist"}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            You can add artist.
                        </p>
                    </div>
                )}
                {dataAvailable && (
                    <div className="flex flex-row flex-wrap gap-4 p-4">
                        {artists.data.map((artist: Artist) => (
                            <CardArtist
                                key={artist.artist_id}
                                artist={artist}
                            />
                        ))}
                    </div>
                )}
            </Card>
        </SkeletonWrapper>
    );
}

function CardArtist({ artist }: { artist: Artist }) {
    return (
        <div className="flex border-separate flex-col px-2 pb-2 justify-between rounded-lg border shadow-sm shadow-black/[0.1] dark:shadow-white/[0.1]">
            <div className="flex flex-col items-center gap-2 p-4">
                <span>{artist.artist_name}</span>
                <Image
                    src={artist.artist_images && artist?.artist_images[0]}
                    width={100}
                    height={100}
                    className="rounded-lg"
                    alt="image"
                />
            </div>
            <div className="w-full flex flex-row gap-2">
                <DeleteArtistDialog
                    artist={artist}
                    trigger={<Button variant="destructive" className="w-1/2"><Trash className="h-4 w-4"/></Button>}
                />
                <EditArtistDialog
                    artist={artist}
                    trigger={<Button className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white"><Pencil className="h-4 w-4"/></Button>}
                />
            </div>
        </div>
    );
}