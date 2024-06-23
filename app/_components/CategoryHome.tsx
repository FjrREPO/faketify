import { Album, Artist, Track } from "@prisma/client";
import SkeletonWrapper from "@/components/loader/skeleton-wrapper";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function CategoryHome({ type, artists, albums, tracks }: { type: any, artists: any, albums: any, tracks: any }) {
    return (
        <div>
            {type.label}
            <div className="flex flex-row gap-7">
                <CategoryCardHome artists={artists} albums={albums} tracks={tracks}/>
            </div>
        </div>
    )
}

function CategoryCardHome({ artists, albums, tracks }: { artists: any, albums: any, tracks: any }) {
    return (
        <SkeletonWrapper isLoading={artists.isLoading || albums.isLoading || tracks.isLoading}>
            {tracks.data && tracks.data.length > 0 &&
                tracks.data.map((track: Track) => {
                    const findArtist = artists.data && artists.data.find((artist: Artist) =>
                        tracks.data && artist.artist_saved_id && track.track_artists_id.includes(artist.artist_saved_id))
                    const findAlbum = albums.data && albums.data.find((album: Album) =>
                        tracks.data && track.track_albums_id && album.album_saved_id && track.track_albums_id.includes(album.album_saved_id))
                    return (
                        <div className="flex w-[160px]" key={track.track_id}>
                            <div className="flex flex-col gap-3">
                                <Image src={findAlbum && findAlbum.album_images[0] ? findAlbum.album_images[0] : ""} alt="image" width={160} height={160} className="rounded-lg" />
                                <Label className="text-sm line-clamp-1">{track.track_name}</Label>
                            </div>
                        </div>
                    )
                })
            }
        </SkeletonWrapper>
    )
}
