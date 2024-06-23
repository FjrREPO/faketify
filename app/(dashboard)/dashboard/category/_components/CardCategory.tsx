"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Images, Pencil, Plus, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SkeletonWrapper from "@/components/loader/skeleton-wrapper";
import { Album, Artist, Category, Playlist, Track } from "@prisma/client";
import Image from "next/image";
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import CreateCategoryDialog from "./CreateCategoryDialog";
import React from "react";
import EditCategoryDialog from "./EditCategoryDialog";

export function CardCategories() {
    const { data: categories, isLoading } = useQuery<Category[]>({
        queryKey: ["category"],
        queryFn: () => fetch(`/api/category`).then(res => res.json()),
    });

    return (
        <>
            <div className="border-b bg-card flex flex-row flex-wrap w-full justify-between">
                <div className="container flex flex-wrap items-center justify-between md:flex-nowrap gap-6 py-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold">Manage Category</h2>
                        <p>Manage your category data such as create and delete category.</p>
                    </div>
                    <CreateCategoryDialog
                        trigger={
                            <Button className="gap-2 text-sm flex flex-row items-center">
                                <Plus className="h-6 w-6" />
                                <span>Add Category</span>
                            </Button>
                        }
                    />
                </div>
            </div>
            <div className="container flex flex-col gap-4 p-4">
                {categories && categories.length > 0 &&
                    categories.map((category: Category) => (
                        <CategoryList key={category.category_id} category={category} />
                    ))
                }
            </div>
        </>
    );
}

const CategoryList = React.memo(function CategoryList({ category }: { category: Category }) {
    const { data: artists } = useQuery<Artist[]>({
        queryKey: ["artist"],
        queryFn: () => fetch(`/api/music/artist`).then(res => res.json()),
    });
    const { data: albums } = useQuery<Album[]>({
        queryKey: ["album"],
        queryFn: () => fetch(`/api/music/album`).then(res => res.json()),
    });
    const { data: tracks } = useQuery<Track[]>({
        queryKey: ["track"],
        queryFn: () => fetch(`/api/music/track`).then(res => res.json()),
    });
    const { data: playlists } = useQuery<Playlist[]>({
        queryKey: ["playlist"],
        queryFn: () => fetch(`/api/music/playlist`).then(res => res.json()),
    });

    const findArtists = artists?.find(artist => category.category_artists_id.includes(artist.artist_id));
    const findAlbums = albums?.find(album => category.category_albums_id.includes(album.album_id));
    const findTracks = tracks?.find(track => category.category_tracks_id.includes(track.track_id));
    const findPlaylists = playlists?.find(playlist => category.category_playlists_id.includes(playlist.playlist_id));

    return (
        <SkeletonWrapper isLoading={artists === undefined || albums === undefined || tracks === undefined}>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Images className="h-12 w-12 items-center rounded-xl p-2" />
                            <span>{category.category_name}</span>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <EditCategoryDialog
                                category={category}
                                trigger={<Button className="flex flex-row items-center gap-2 justify-center w-fit bg-blue-500 hover:bg-blue-600 text-white"><Pencil className="h-4 w-4" /><span className="pt-0.5">Edit</span></Button>}
                            />
                            <DeleteCategoryDialog
                                category={category}
                                trigger={<Button variant="destructive" className="flex flex-row items-center gap-2 justify-center w-fit"><Trash className="h-4 w-4" /><span className="pt-1">Delete</span></Button>}
                            />
                        </div>
                    </CardTitle>
                </CardHeader>
                <Separator />
                {category.category_type === "artists" ? (
                    <div className="flex flex-row flex-wrap gap-4 p-4">
                        {category.category_artists_saved_id.map((cat: any) => {
                            const findArtistsSaved = artists?.find(artist => cat.includes(artist.artist_saved_id ?? ''));
                            return (
                            <CardCategory key={cat} label={findArtistsSaved && findArtistsSaved.artist_name ? findArtistsSaved.artist_name : ""} image={findArtistsSaved && findArtistsSaved.artist_images[0] ? findArtistsSaved.artist_images[0] : ""} />
                        )})}
                    </div>
                ) : findArtists ? (
                    <div className="flex flex-row flex-wrap gap-4 p-4">
                        {category.category_artists_id.map((cat: any) => {
                            const findArtists = artists?.find(artist => cat.includes(artist.artist_id ?? ''));
                            return (
                                <CardCategory key={cat} label={findArtists && findArtists.artist_name ? findArtists.artist_name : ""} image={findArtists && findArtists.artist_images[0] ? findArtists.artist_images[0] : ""} />
                            )
                        })}
                    </div>
                ) : (
                    null
                )}
                {category.category_type === "albums" ? (
                    <div className="flex flex-row flex-wrap gap-4 p-4">
                        {category.category_albums_saved_id.map((cat: any) => {
                            const findAlbumsSaved = albums?.find(album => cat.includes(album.album_saved_id ?? ''));
                            return (
                                <CardCategory key={cat} label={findAlbumsSaved && findAlbumsSaved.album_name ? findAlbumsSaved.album_name : ""} image={findAlbumsSaved && findAlbumsSaved.album_images[0] ? findAlbumsSaved.album_images[0] : ""} />
                            )
                        })}
                    </div>
                ) : findAlbums ? (
                    <div className="flex flex-row flex-wrap gap-4 p-4">
                        {category.category_albums_id.map((cat: any) => {
                            const findAlbums = albums?.find(album => cat.includes(album.album_id ?? ''));
                            return (
                                <CardCategory key={cat} label={findAlbums && findAlbums.album_name ? findAlbums.album_name : ""} image={findAlbums && findAlbums.album_images[0] ? findAlbums.album_images[0] : ""} />
                            )
                        })}
                    </div>
                ) : (
                    null
                )}
                {category.category_type === "tracks" ? (
                    <div className="flex flex-row flex-wrap gap-4 p-4">
                        {category.category_tracks_saved_id.map((cat: any) => {
                            const findAlbumsImage = albums?.find(album => cat.includes(album.album_tracks_id ?? ''));
                            const findTracksSaved = tracks?.find(track => cat.includes(track.track_saved_id ?? ''));

                            return (
                                <CardCategory key={cat} label={findTracksSaved && findTracksSaved.track_name ? findTracksSaved.track_name : ""} image={findAlbumsImage && findAlbumsImage.album_images[0] ? findAlbumsImage.album_images[0] : ""} />
                            )
                        })}
                    </div>
                ) : findTracks ? (
                    <div className="flex flex-row flex-wrap gap-4 p-4">
                        {category.category_tracks_id.map((cat: any) => {
                            const findAlbumsImage = albums?.find(album => cat.includes(album.album_tracks_id ?? ''));
                            const findTracks = tracks?.find(track => cat.includes(track.track_id ?? ''));
                            return (
                                <CardCategory key={cat} label={findTracks && findTracks.track_name ? findTracks.track_name : ""} image={findAlbumsImage && findAlbumsImage.album_images[0] ? findAlbumsImage.album_images[0] : ""} />
                            )
                        })}
                    </div>
                ) : (
                    null
                )}
                {category.category_type === "playlists" ? (
                    <div className="flex flex-row flex-wrap gap-4 p-4">
                        {category.category_playlists_saved_id.map((cat: any) => {
                            const findPlaylistsSaved = playlists?.find(playlist => cat.includes(playlist.playlist_saved_id ?? ''));
                            console.log(findPlaylistsSaved)
                            return (
                                <CardCategory key={cat} label={findPlaylistsSaved && findPlaylistsSaved.playlist_name ? findPlaylistsSaved.playlist_name : ""} image={findPlaylistsSaved && findPlaylistsSaved.playlist_images[0] ? findPlaylistsSaved.playlist_images[0] : ""} />
                            )
                        })}
                    </div>
                ) : findPlaylists ? (
                    <div className="flex flex-row flex-wrap gap-4 p-4">
                        {category.category_playlists_id.map((cat: any) => {
                            const findPlaylists = playlists?.find(playlist => cat.includes(playlist.playlist_id ?? ''));
                            return (
                                <CardCategory key={cat} label={findPlaylists && findPlaylists.playlist_name ? findPlaylists.playlist_name : ""} image={findPlaylists && findPlaylists.playlist_images[0] ? findPlaylists.playlist_images[0] : ""} />
                            )
                        })}
                    </div>
                ) : (
                    null
                )}
            </Card>
        </SkeletonWrapper>
    );
});

export function CardCategory({ label, image }: { label: string; image: string }) {
    return (
        <div className="flex border-separate flex-col px-2 pb-2 justify-between rounded-lg border shadow-sm shadow-black/[0.1] dark:shadow-white/[0.1]">
            <div className="flex flex-col items-center gap-2 p-4">
                <span className="max-w-[200px] line-clamp-2">{label || ""}</span>
                <Image src={image || 'https://res.cloudinary.com/dutlw7bko/image/upload/v1718969701/faketify/placeholder-img_wbhjm1.png'} width={100} height={100} className="rounded-lg" alt="image" />
            </div>
        </div>
    );
}