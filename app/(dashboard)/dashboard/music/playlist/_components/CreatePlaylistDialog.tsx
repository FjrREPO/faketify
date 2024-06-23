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
import { getPlaylistSpotify } from '@/lib/spotify/search/get-playlist-spotify';
import { getPlaylistByIdSpotify } from '@/lib/spotify/playlist/get-playlist-byid-spotify';

interface Props {
    trigger: React.ReactNode;
}

export default function CreatePlaylistDialog({ trigger }: Props) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [data, setData] = useState<any>([]);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');
    const { token, loading, setLoading, error, setError } = useContext<any>(SpotifyContext);
    const [pending, setPending] = useState(false);

    const [playlistName, setPlaylistName] = useState('');
    const [playlistDescription, setPlaylistDescription] = useState('');
    const [playlistImages, setPlaylistImages] = useState<any[]>([]);
    const [playlistFollowers, setPlaylistFollowers] = useState('');
    const [playlistArtistsId, setPlaylistArtistsId] = useState<any[]>([]);
    const [playlistAlbumsId, setPlaylistAlbumsId] = useState<any[]>([]);
    const [playlistTracksId, setPlaylistTracksId] = useState<any[]>([]);
    const [playlistSavedId, setPlaylistSavedId] = useState<string>('');

    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<FieldValues>({
        defaultValues: {},
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        if (pending) return;

        setPending(true);

        try {
            const formattedData = {
                ...data
            };
            console.log(formattedData)
            await axios.post('/api/music/playlist', formattedData);
            toast.success('Playlist created successfully!');
            reset();
            setOpen(false);
            setTimeout(() => {
                window.location.reload()
            }, 1500)
        } catch (error) {
            toast.error('Failed to create playlist.');
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
                const fetchedData: any = await getPlaylistSpotify(query, token);
                setData(fetchedData);
            } catch (error) {
                setError('Failed to fetch playlists');
            } finally {
                setLoading(false);
            }
        };

        const fetchPlaylistDataById = async () => {
            if (!selectedPlaylistId) return
            try {
                const playlistData: any = await getPlaylistByIdSpotify(selectedPlaylistId, token);
                setPlaylistName(playlistData.name);
                setPlaylistDescription(playlistData.description);
                setPlaylistFollowers(playlistData.followers.total);
                setPlaylistImages(playlistData.images.map((image: any) => image.url));
                setPlaylistArtistsId(playlistData.tracks.items.flatMap((track: any) => track.track.artists.map((artist: any) => artist.id)));
                setPlaylistAlbumsId(playlistData.tracks.items.map((track: any) => track.track.album.id));
                setPlaylistTracksId(playlistData.tracks.items.map((track: any) => track.track.id));
                setPlaylistSavedId(playlistData.id);

                setValue('playlist_name', playlistData.name);
                setValue('playlist_description', playlistData.description);
                setValue('playlist_followers', playlistData.followers.total);
                setValue('playlist_images', playlistData.images.map((image: any) => image.url));
                setValue('playlist_artists_id', playlistData.tracks.items.flatMap((track: any) => track.track.artists.map((artist: any) => artist.id)));
                setValue('playlist_albums_id', playlistData.tracks.items.map((track: any) => track.track.album.id));
                setValue('playlist_tracks_id', playlistData.tracks.items.map((track: any) => track.track.id));
                setValue('playlist_saved_id', playlistData.id);
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
            fetchPlaylistDataById();
        }, 500);

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [query, token, setLoading, setError, selectedPlaylistId, pending, setValue]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Playlist</DialogTitle>
                </DialogHeader>
                <div className='flex flex-row gap-5'>
                    <div className='w-1/2'>
                        <Input
                            type="text"
                            value={query}
                            onChange={(e: any) => setQuery(e.target.value)}
                            placeholder="Search for playlist"
                        />
                    </div>
                    <div className='w-1/2'>
                        <Select>
                            <SelectTrigger>
                                <Input
                                    type='text'
                                    readOnly
                                    value={playlistName ? playlistName : "Select playlist"}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {data.map((playlist: any) => (
                                    <SelectGroup
                                        key={playlist.id}
                                        className='cursor-pointer'
                                        onClick={() => {
                                            setSelectedPlaylistId(playlist.id);
                                        }}
                                    >
                                        {playlist.name}
                                    </SelectGroup>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className='w-full flex flex-row gap-5'>
                        <div className='w-full'>
                            <Label>Playlist Name</Label>
                            <Input {...register('playlist_name')} value={playlistName} placeholder='Playlist Name' onChange={(e) => {
                                setPlaylistName(e.target.value);
                            }} />
                        </div>
                    </div>
                    <div className='w-full flex flex-row gap-5'>
                        <div className='w-1/2'>
                            <Label>Playlist Description</Label>
                            <Input type="text" {...register('playlist_description')} value={playlistDescription} onChange={(e) => {
                                setPlaylistDescription(e.target.value);
                            }} />
                        </div>
                        <div className='w-1/2'>
                            <Label>Playlist Followers</Label>
                            <Input type="text" {...register('playlist_followers')} value={playlistFollowers} onChange={(e) => {
                                setPlaylistFollowers(e.target.value);
                            }} />
                        </div>
                    </div>
                    <div className='w-full'>
                        <Label>Playlist Images</Label>
                        <ImageUpload
                            value={playlistImages}
                            onChange={(e: any) => {
                                setPlaylistImages(e.target.value);
                                setValue('playlist_images', e);
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