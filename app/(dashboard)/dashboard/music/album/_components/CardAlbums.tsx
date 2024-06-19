"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Images, Pencil, Plus, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import SkeletonWrapper from "@/components/loader/skeleton-wrapper";
import CreateAlbumDialog from "./CreateAlbumDialog";
import { Album } from "@prisma/client";
import DeleteAlbumDialog from "../../album/_components/DeleteAlbumDialog";
import Image from "next/image";
import EditAlbumDialog from "../../album/_components/EditAlbumDialog";

export default function CardAlbums() {
    return (
        <>
            <div className="border-b bg-card">
                <div className="container flex flex-wrap items-center justify-between md:flex-nowrap gap-6 py-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold">Manage Album</h2>
                        <p>
                            Manage your albums data such create and delete album.
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
    const albums = useQuery({
        queryKey: ["album"],
        queryFn: () =>
            fetch(`/api/music/album`).then((res) => res.json()),
    });

    const dataAvailable = albums.data && albums.data.length > 0;

    return (
        <SkeletonWrapper isLoading={albums.isLoading}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Images className="h-12 w-12 items-center rounded-xl p-2" />
                            <span>
                                Album
                            </span>
                        </div>

                        <CreateAlbumDialog
                            trigger={
                                <Button className="gap-2 text-sm flex flex-row items-center">
                                    <Plus className="h-6 w-6" />
                                    <span>Add Album</span>
                                </Button>
                            }
                        />
                    </CardTitle>
                </CardHeader>
                <Separator />
                {!dataAvailable && (
                    <div className="flex h-40 w-full flex-col items-center justify-center">
                        <p>
                            Album not found{" "}
                            <span
                                className={cn(
                                    "m-1",
                                    "text-green-500"
                                )}
                            >
                                {"Album"}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            You can add album.
                        </p>
                    </div>
                )}
                {dataAvailable && (
                    <div className="flex flex-row flex-wrap gap-4 p-4">
                        {albums.data.map((album: Album) => (
                            <CardAlbum
                                key={album.album_id}
                                album={album}
                            />
                        ))}
                    </div>
                )}
            </Card>
        </SkeletonWrapper>
    );
}

function CardAlbum({ album }: { album: Album }) {
    return (
        <div className="flex border-separate flex-col px-2 pb-2 justify-between rounded-lg border shadow-sm shadow-black/[0.1] dark:shadow-white/[0.1]">
            <div className="flex flex-col items-center gap-2 p-4">
                <span>{album.album_name}</span>
                <Image
                    src={album.album_images && album?.album_images[0]}
                    width={100}
                    height={100}
                    className="rounded-lg"
                    alt="image"
                />
            </div>
            <div className="w-full flex flex-row gap-2">
                <DeleteAlbumDialog
                    album={album}
                    trigger={<Button variant="destructive" className="w-1/2"><Trash className="h-4 w-4"/></Button>}
                />
                <EditAlbumDialog
                    album={album}
                    trigger={<Button className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white"><Pencil className="h-4 w-4"/></Button>}
                />
            </div>
        </div>
    );
}