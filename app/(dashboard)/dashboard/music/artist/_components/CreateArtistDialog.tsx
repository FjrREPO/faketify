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
import { musicGenres } from '@/data/music-genres';
import { Label } from '@/components/ui/label';
import { Loader } from 'lucide-react';
import { getArtistByIdSpotify } from '@/lib/spotify/artist/get-artist-byid-spotify';
import { getArtistsSpotify } from '@/lib/spotify/search/get-artist-spotify';

interface Props {
    trigger: React.ReactNode;
}

export default function CreateArtistDialog({ trigger }: Props) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [data, setData] = useState<any>([]);
    const [selectedArtistId, setSelectedArtistId] = useState<string>('');
    const { token, loading, setLoading, error, setError } = useContext<any>(SpotifyContext);
    const [pending, setPending] = useState(false);

    const [artistName, setArtistName] = useState<string>('');
    const [artistPopularity, setArtistPopularity] = useState<number>(0);
    const [artistFollowers, setArtistFollowers] = useState<number>(0);
    const [artistImages, setArtistImages] = useState<string[]>([]);
    const [artistGenres, setArtistGenres] = useState<string[]>([]);
    const [artistSavedId, setArtistSavedId] = useState<string>('');


    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<FieldValues>({
        defaultValues: {},
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        if (pending) return;

        setPending(true);

        try {
            const formattedData = {
                ...data,
                artistName: artistName,
                artistPopularity: artistPopularity,
                artistFollowers: artistFollowers,
                artistImages: artistImages,
                artistGenres: artistGenres,
                artistSavedId: artistSavedId
            };
            await axios.post('/api/music/artist', formattedData);
            toast.success('Artist created successfully!');
            reset();
            setOpen(false);
            setTimeout(() => {
                window.location.reload()
            }, 1500)
        } catch (error) {
            toast.error('Failed to create artist.');
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
                const fetchedData: any = await getArtistsSpotify(query, token);
                setData(fetchedData);
            } catch (error) {
                setError('Failed to fetch artists');
            } finally {
                setLoading(false);
            }
        };

        const fetchArtistDataById = async () => {
            if (!selectedArtistId) return
            try {
                const artistData: any = await getArtistByIdSpotify(selectedArtistId, token);
                setArtistName(artistData.name);
                setArtistPopularity(artistData.popularity);
                setArtistFollowers(artistData.followers.total);
                setArtistImages(artistData.images.map((image: any) => image.url));
                setArtistGenres(artistData.genres);
                setArtistSavedId(artistData.id);

                setValue('artist_name', artistData.name);
                setValue('artist_followers', artistData.followers.total);
                setValue('artist_popularity', artistData.popularity);
                setValue('artist_release_date', artistData.release_date);
                setValue('artist_images', artistData.images.map((image: any) => image.url));
                setValue('artist_genres', artistData.genres);
                setValue('artist_saved_id', artistData.id.toString());
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
    }, [query, token, setLoading, setError, selectedArtistId, pending]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Artist</DialogTitle>
                </DialogHeader>
                <div className='flex flex-row gap-5'>
                    <div className='w-1/2'>
                        <Input
                            type="text"
                            value={query}
                            onChange={(e: any) => setQuery(e.target.value)}
                            placeholder="Search for artist"
                        />
                    </div>
                    <div className='w-1/2'>
                        <Select>
                            <SelectTrigger>
                                <Input
                                    type='text'
                                    readOnly
                                    value={artistName ? artistName : "Select artist"}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {data.map((artist: any) => (
                                    <SelectGroup
                                        key={artist.id}
                                        className='cursor-pointer'
                                        onClick={() => {
                                            setSelectedArtistId(artist.id);
                                        }}
                                    >
                                        {artist.name}
                                    </SelectGroup>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className='w-full flex flex-row gap-5'>
                        <div className='w-1/2'>
                            <Label>Artist Name</Label>
                            <Input {...register('artist_name')} value={artistName} placeholder='Artist Name' onChange={(e) => {
                                setArtistName(e.target.value);
                            }} />
                        </div>
                        <div className='w-1/2'>
                            <Label>Genre</Label>
                            <Select>
                                <SelectTrigger>
                                    <Input
                                        type='text'
                                        readOnly
                                        value={artistGenres.length > 0 ? artistGenres.join(', ') : "Select genre"}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {musicGenres.genres.map((genre: string, index: number) => (
                                        <SelectGroup
                                            key={index}
                                            className='cursor-pointer'
                                            onClick={() => {
                                                const updatedGenres = artistGenres.includes(genre)
                                                    ? artistGenres.filter((g) => g !== genre)
                                                    : [...artistGenres, genre];
                                                setArtistGenres(updatedGenres);
                                                setValue('artist_genres', updatedGenres);
                                            }}
                                        >
                                            {genre}
                                        </SelectGroup>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className='w-full flex flex-row gap-5'>
                        <div className='w-1/2'>
                            <Label>Artist Popularity</Label>
                            <Input type="number" {...register('artist_popularity')} value={artistPopularity} onChange={(e) => {
                                setArtistPopularity(parseInt(e.target.value));
                            }} />
                        </div>
                        <div className='w-1/2'>
                            <Label>Artist Followers</Label>
                            <Input type="number" {...register('artist_followers')} value={artistFollowers} onChange={(e) => {
                                setArtistFollowers(parseInt(e.target.value));
                            }} />
                        </div>
                    </div>
                    <div className='w-full'>
                        <Label>Artist Images</Label>
                        <ImageUpload
                            value={artistImages}
                            onChange={(e: any) => {
                                setArtistImages(e.target.value);
                                setValue('artist_images', e);
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