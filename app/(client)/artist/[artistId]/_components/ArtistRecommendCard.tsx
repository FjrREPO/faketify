import { Label } from '@/components/ui/label';
import { Album, Artist, Track } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default function ArtistRecommendCard({ tracksData, albumsData, artistsData, findArtistById }: { tracksData: Track[], albumsData: Album[], artistsData: Artist[], findArtistById: Artist }) {
    const findAllTracksByArtistId = tracksData?.filter((track) => track.track_artists_id.includes(findArtistById.artist_saved_id ?? ''));

    return (
        <div className="flex flex-col">
            {findAllTracksByArtistId.map((track) => {
                const findAlbumsByTrackId = albumsData?.find((album) => album.album_tracks_id.includes(track?.track_saved_id ?? ''));
                const findArtistsByTrackId = artistsData?.find((artist) => track?.track_artists_id.includes(artist?.artist_saved_id ? artist.artist_saved_id : ''));
                const findAllArtistsByTrack = artistsData?.filter((artist) => track.track_artists_id.includes(artist.artist_saved_id ?? ''));

                const durationInSeconds = Math.floor((track.track_duration_ms ?? 0) / 1000);
                const minutes = Math.floor(durationInSeconds / 60);
                const seconds = durationInSeconds % 60;

                return (
                    <Link href={`/track/${track.track_id}`} key={track.track_id} className="grid grid-cols-3 hover:bg-foreground/20 rounded-lg p-2 cursor-pointer">
                        <div className="flex flex-row gap-3 place-content-start">
                            <Image src={findAlbumsByTrackId?.album_images[0] || ""} alt="" className="w-10 rounded-sm" width={10} height={10} />
                            <div className="flex flex-col gap-1 justify-center">
                                <Label className="capitalize hover:underline cursor-pointer">{track.track_name}</Label>
                                <div className="flex flex-row whitespace-break-spaces text-textsecondary">
                                    {
                                        findAllArtistsByTrack?.map((artist, index) => (
                                            <React.Fragment key={artist.artist_id}>
                                                <Link href={`/artist/${artist.artist_id}`} className='hover:text-foreground hover:underline'>{artist.artist_name}</Link>
                                                {index !== findAllArtistsByTrack.length - 1 && ', '}
                                            </React.Fragment>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='flex place-content-end items-center text-textsecondary'>
                            <Label>{findArtistsByTrackId?.artist_followers && findArtistsByTrackId?.artist_followers.toLocaleString() || ''}</Label>
                        </div>
                        <div className='flex flex-row items-center gap-0.5 text-textsecondary place-content-end'>
                            <Label>{minutes}:{seconds.toString().padStart(2, '0')}</Label>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
