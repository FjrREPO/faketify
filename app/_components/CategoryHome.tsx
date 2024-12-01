'use client';

import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/loader/skeleton-wrapper";
import { Album, Artist, Category, Playlist, Track } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { CardArtistsHome } from "./CardArtistsHome";
import { CardTracksHome } from "./CardTracksHome";
import { CardPlaylistsHome } from "./CardPlaylistsHome";
import { CardAlbumsHome } from "./CardAlbumsHome";
import React from "react";
import Link from "next/link";

export const CategoryHome = () => {
    const { data: categories, isLoading } = useQuery<Category[]>({
        queryKey: ["category"],
        queryFn: () => fetch(`/api/category`).then(res => res.json()),
    });

    return (
        <div className="flex flex-col relative gap-10 pt-5 pl-5">
            {categories && categories.length > 0 &&
                categories.map((category: Category) => (
                    <CategoryList key={category.category_id} category={category} />
                ))
            }
        </div>
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
            <div className="flex flex-col gap-4">
                <div className="flex items-end justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Label className="text-2xl">{category.category_name}</Label>
                    </div>
                    <div className="flex">
                        <Link href={`/category/${category.category_id}`}><Label className="hover:underline hover:text-black dark:hover:text-white cursor-pointer duration-200 text-textsecondary">Show all</Label></Link>
                    </div>
                </div>
                {category.category_type === "artists" ? (
                    <div className="flex flex-row overflow-x-hidden gap-4">
                        {category.category_artists_saved_id.slice(0, 6).map((cat: any) => {
                            const findArtistsSaved = artists?.find(artist => cat.includes(artist.artist_saved_id ?? ''));
                            return (
                                <CardArtistsHome key={cat} label={findArtistsSaved && findArtistsSaved.artist_name ? findArtistsSaved.artist_name : ""} image={findArtistsSaved && findArtistsSaved.artist_images[0] ? findArtistsSaved.artist_images[0] : ""} id={findArtistsSaved && findArtistsSaved.artist_id ? findArtistsSaved.artist_id : ""}/>
                            )
                        })}
                    </div>
                ) : findArtists ? (
                    <div className="flex flex-row overflow-x-hidden gap-4">
                        {category.category_artists_id.slice(0, 6).map((cat: any) => {
                            const findArtists = artists?.find(artist => cat.includes(artist.artist_id ?? ''));
                            return (
                                <CardArtistsHome key={cat} label={findArtists && findArtists.artist_name ? findArtists.artist_name : ""} image={findArtists && findArtists.artist_images[0] ? findArtists.artist_images[0] : ""} id={findArtists && findArtists.artist_id ? findArtists.artist_id : ""}/>
                            )
                        })}
                    </div>
                ) : (
                    null
                )}
                {category.category_type === "albums" ? (
                    <div className="flex flex-row overflow-x-hidden gap-1">
                        {category.category_albums_saved_id.slice(0, 6).map((cat: any) => {
                            const findAlbumsSaved = albums?.find(album => cat.includes(album.album_saved_id ?? ''));
                            return (
                                <CardAlbumsHome key={cat} label={findAlbumsSaved && findAlbumsSaved.album_name ? findAlbumsSaved.album_name : ""} image={findAlbumsSaved && findAlbumsSaved.album_images[0] ? findAlbumsSaved.album_images[0] : ""} />
                            )
                        })}
                    </div>
                ) : findAlbums ? (
                    <div className="flex flex-row overflow-x-hidden gap-1">
                        {category.category_albums_id.slice(0, 6).map((cat: any) => {
                            const findAlbums = albums?.find(album => cat.includes(album.album_id ?? ''));
                            return (
                                <CardAlbumsHome key={cat} label={findAlbums && findAlbums.album_name ? findAlbums.album_name : ""} image={findAlbums && findAlbums.album_images[0] ? findAlbums.album_images[0] : ""} />
                            )
                        })}
                    </div>
                ) : (
                    null
                )}
                {category.category_type === "tracks" ? (
                    <div className="flex flex-row w-full overflow-x-hidden gap-1">
                        {category.category_tracks_saved_id.slice(0, 6).map((cat: any) => {
                            const findTracksSaved = tracks?.find(track => cat.includes(track.track_saved_id ?? ''));
                            const findAlbumsImage = albums?.find(album => findTracksSaved?.track_saved_id && album.album_tracks_id.includes(findTracksSaved?.track_saved_id ?? ''));

                            return (
                                <CardTracksHome key={cat} label={findTracksSaved && findTracksSaved.track_name ? findTracksSaved.track_name : ""} image={findAlbumsImage && findAlbumsImage.album_images[0] ? findAlbumsImage.album_images[0] : ""} id={findTracksSaved && findTracksSaved.track_id ? findTracksSaved.track_id : ""} track={findTracksSaved!} />
                            )
                        })}
                    </div>
                ) : findTracks ? (
                    <div className="flex flex-row overflow-x-hidden gap-1">
                        {category.category_tracks_id.slice(0, 6).map((cat: any) => {
                            const findAlbumsImage = albums?.find(album => cat.includes(album.album_tracks_id ?? ''));
                            const findTracks = tracks?.find(track => cat.includes(track.track_id ?? ''));
                            return (
                                <CardTracksHome key={cat} label={findTracks && findTracks.track_name ? findTracks.track_name : ""} image={findAlbumsImage && findAlbumsImage.album_images[0] ? findAlbumsImage.album_images[0] : ""} id="" track={findTracks!} />
                            )
                        })}
                    </div>
                ) : (
                    null
                )}
                {category.category_type === "playlists" ? (
                    <div className="flex flex-row overflow-x-hidden gap-1">
                        {category.category_playlists_saved_id.slice(0, 6).map((cat: any) => {
                            const findPlaylistsSaved = playlists?.find(playlist => cat.includes(playlist.playlist_saved_id ?? ''));
                            return (
                                <CardPlaylistsHome key={cat} label={findPlaylistsSaved && findPlaylistsSaved.playlist_name ? findPlaylistsSaved.playlist_name : ""} image={findPlaylistsSaved && findPlaylistsSaved.playlist_images[0] ? findPlaylistsSaved.playlist_images[0] : ""} trackData={tracks!} playlist={findPlaylistsSaved!} />
                            )
                        })}
                    </div>
                ) : findPlaylists ? (
                    <div className="flex flex-row overflow-x-hidden gap-1">
                        {category.category_playlists_id.slice(0, 6).map((cat: any) => {
                            const findPlaylists = playlists?.find(playlist => cat.includes(playlist.playlist_id ?? ''));
                            return (
                                <CardPlaylistsHome key={cat} label={findPlaylists && findPlaylists.playlist_name ? findPlaylists.playlist_name : ""} image={findPlaylists && findPlaylists.playlist_images[0] ? findPlaylists.playlist_images[0] : ""} trackData={tracks!} playlist={findPlaylists!} />
                            )
                        })}
                    </div>
                ) : (
                    null
                )}
            </div>
        </SkeletonWrapper>
    );
});