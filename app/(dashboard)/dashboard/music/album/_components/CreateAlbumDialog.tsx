"use client";

import { useState, useEffect, useContext } from 'react';
import { SpotifyContext } from '@/components/providers/spotify-provider';
import axios from 'axios';
import { Select, SelectContent, SelectGroup, SelectTrigger } from '@/components/ui/select';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import ImageUpload from '@/components/uploader/image-upload';
import { Label } from '@/components/ui/label';
import { Loader } from 'lucide-react';
import { getAlbumByIdSpotify } from '@/lib/spotify/album/get-album-byid-spotify';
import { getAlbumsSpotify } from '@/lib/spotify/search/get-album-spotify';

interface Props {
    trigger: React.ReactNode;
}

export default function CreateAlbumDialog({ trigger }: Props) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [data, setData] = useState<any>([]);
    const { token, loading, setLoading, error, setError } = useContext<any>(SpotifyContext);
    const [pending, setPending] = useState(false);

    const [selectedAlbumId, setSelectedAlbumId] = useState<string>('');
    const [albumName, setAlbumName] = useState<string>('');
    const [albumPopularity, setAlbumPopularity] = useState<number>(0);
    const [albumReleaseDate, setAlbumReleaseDate] = useState<string>('');
    const [albumImages, setAlbumImages] = useState<string[]>([]);
    const [albumTracksId, setAlbumTracksId] = useState<string[]>([]);
    const [albumArtistsId, setAlbumArtistsId] = useState<string[]>([]);
    const [albumSavedId, setAlbumSavedId] = useState<string>('');


    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<FieldValues>({
        defaultValues: {},
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        if (pending) return;

        setPending(true);

        try {
            const formattedData = {
                ...data,
                albumName: albumName,
                albumPopularity: albumPopularity,
                albumReleaseDate: albumReleaseDate,
                albumImages: albumImages,
                albumTracksId: albumTracksId,
                albumArtistsId: albumArtistsId,
                albumSavedId: albumSavedId
            };
            await axios.post('/api/music/album', formattedData);
            toast.success('Album created successfully!');
            reset();
            setOpen(false);
            setTimeout(() => {
                window.location.reload()
            }, 1500)
        } catch (error) {
            toast.error(`Failed to create album.`);
        } finally {
            setPending(false);
        }
    };

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | null = null;

        const fetchSpotifyData = async () => {
            if (!token || query.length < 2) return;
            setLoading(true);
            setError(null);

            try {
                const fetchedData: any = await getAlbumsSpotify(query, token);
                setData(fetchedData);
            } catch (error) {
                setError('Failed to fetch albums');
            } finally {
                setLoading(false);
            }
        };

        const fetchArtistDataById = async () => {
            if (!selectedAlbumId) return
            try {
                const artistData: any = await getAlbumByIdSpotify(selectedAlbumId, token);
                setAlbumName(artistData.name);
                setAlbumPopularity(artistData.popularity);
                setAlbumReleaseDate(artistData.release_date);
                setAlbumImages(artistData.images.map((image: any) => image.url));
                setAlbumTracksId(artistData.tracks.items.map((track: any) => track.id));
                setAlbumArtistsId(artistData.artists.map((artist: any) => artist.id));
                setAlbumSavedId(artistData.id);

                setValue('album_name', artistData.name);
                setValue('album_popularity', artistData.popularity);
                setValue('album_release_date', artistData.release_date);
                setValue('album_images', artistData.images.map((image: any) => image.url));
                setValue('album_tracks_id', artistData.tracks.items.map((track: any) => track.id));
                setValue('album_artists_id', artistData.artists.map((artist: any) => artist.id));
                setValue('album_saved_id', artistData.id);
            } catch (error) {
                console.error(error);
            } finally {
                setPending(false);
            }
        }

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            fetchSpotifyData();
            fetchArtistDataById();
        }, 500);

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [query, token, setLoading, setError, selectedAlbumId, pending]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Album</DialogTitle>
                </DialogHeader>
                <div className='flex flex-row gap-5'>
                    <div className='w-1/2'>
                        <Input
                            type="text"
                            value={query}
                            onChange={(e: any) => setQuery(e.target.value)}
                            placeholder="Search for album"
                        />
                    </div>
                    <div className='w-1/2'>
                        <Select>
                            <SelectTrigger>
                                <Input
                                    type='text'
                                    readOnly
                                    value={albumName ? albumName : "Select album"}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {data.map((album: any) => (
                                    <SelectGroup
                                        key={album.id}
                                        className='cursor-pointer'
                                        onClick={() => {
                                            setSelectedAlbumId(album.id);
                                        }}
                                    >
                                        {album.name}
                                    </SelectGroup>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className='w-full flex flex-row gap-5'>
                        <div className='w-full'>
                            <Label>Album Name</Label>
                            <Input {...register('album_name')} value={albumName} placeholder='Album Name' onChange={(e) => {
                                setAlbumName(e.target.value);
                            }} />
                        </div>
                    </div>
                    <div className='w-full flex flex-row gap-5'>
                        <div className='w-1/2'>
                            <Label>Album Popularity</Label>
                            <Input type="number" {...register('album_popularity')} value={albumPopularity} onChange={(e) => {
                                setAlbumPopularity(parseInt(e.target.value));
                            }} />
                        </div>
                        <div className='w-1/2'>
                            <Label>Album Release Date</Label>
                            <Input type="date" {...register('album_release_date')} value={albumReleaseDate} onChange={(e) => {
                                setAlbumReleaseDate(e.target.value);
                            }} />
                        </div>
                    </div>
                    <div className='w-full'>
                        <Label>Album Images</Label>
                        <ImageUpload
                            value={albumImages}
                            onChange={(e: any) => {
                                setAlbumImages(e.target.value);
                                setValue('album_images', e);
                            }}
                        />
                    </div>
                </form>
                <DialogFooter>
                    <DialogClose>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={handleSubmit(onSubmit)} disabled={pending}>
                        {pending && <Loader className="shrink-0 h-4 w-4 mr-2 animate-spin" />}
                        {pending ? "Creating..." : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}