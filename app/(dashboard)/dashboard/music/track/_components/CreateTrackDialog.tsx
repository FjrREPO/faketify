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
import { Label } from '@/components/ui/label';
import { Loader } from 'lucide-react';
import { getTrackByIdSpotify } from '@/lib/spotify/track/get-track-byid-spotify';
import { getTracksSpotify } from '@/lib/spotify/search/get-track-spotify';
import MusicUpload from '@/components/uploader/music-upload';

interface Props {
    trigger: React.ReactNode;
}
interface SpotifyTrack {
    id: string;
    name: string;
    popularity: number;
    duration_ms: number;
    album: { id: string };
    artists: { id: string; name: string; }[];
}

export default function CreateTrackDialog({ trigger }: Props) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    
    const [data, setData] = useState<SpotifyTrack[]>([]);
    const { token, loading, setLoading, error, setError } = useContext<SpotifyContextType>(SpotifyContext);
    const [pending, setPending] = useState(false);

    const [selectedTrackId, setSelectedTrackId] = useState<string>('');
    const [trackName, setTrackName] = useState<string>('');
    const [trackPopularity, setTrackPopularity] = useState<number>(0);
    const [trackDurationMs, setTrackDurationMs] = useState<number>(0);
    const [trackFile, setTrackFile] = useState<string>('');
    const [trackAlbumsId, setAlbumsTracksId] = useState<string>('');
    const [trackArtistsId, setTrackArtistsId] = useState<string[]>([]);
    const [trackSavedId, setTrackSavedId] = useState<string>('');

    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<FieldValues>({
        defaultValues: {},
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        if (pending) return;

        setPending(true);

        console.log('data', data);

        try {
            const formattedData = {
                ...data
            };
            await axios.post('/api/music/track', formattedData);
            toast.success('Track created successfully!');
            reset();
            setOpen(false);
            setTimeout(() => {
                window.location.reload()
            }, 1500)
        } catch (error) {
            toast.error(`Failed to create track.`);
        } finally {
            setPending(false);
        }
    };

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | null = null;

        const fetchSpotifyData = async () => {
            if (!token || query.length < 2) return;
            setLoading!(true);
            setError!(null);

            try {
                const fetchedData = await getTracksSpotify(query, token);
                setData(fetchedData);
            } catch (error) {
                setError!('Failed to fetch tracks');
            } finally {
                setLoading!(false);
            }
        };

        const fetchArtistDataById = async () => {
            if (!selectedTrackId) return
            try {
                const artistData = await getTrackByIdSpotify(selectedTrackId, token!);
                const track = Array.isArray(artistData) ? artistData[0] : artistData;
                setTrackName(track.name);
                setTrackPopularity(track.popularity);
                setTrackDurationMs(track.duration_ms);
                setAlbumsTracksId(track.album.id);
                setTrackArtistsId(track.artists.map((artist: { id: string }) => artist.id));
                setTrackSavedId(track.id);

                setValue('track_name', track.name);
                setValue('track_popularity', track.popularity);
                setValue('track_duration_ms', track.duration_ms);
                setValue('track_albums_id', track.album.id)
                setValue('track_artists_id', track.artists.map((artist: { id: string }) => artist.id));
                setValue('track_saved_id', track.id);
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
    }, [query, token, setLoading, setError, selectedTrackId, pending, setValue]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Track</DialogTitle>
                </DialogHeader>
                <div className='flex flex-row gap-5'>
                    <div className='w-1/2'>
                        <Input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for track"
                        />
                    </div>
                    <div className='w-1/2'>
                        <Select>
                            <SelectTrigger>
                                <Input
                                    type='text'
                                    readOnly
                                    value={trackName ? trackName : "Select track"}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {data.map((track) => (
                                    <SelectGroup
                                        key={track.id}
                                        className='cursor-pointer'
                                        onClick={() => {
                                            setSelectedTrackId(track.id);
                                        }}
                                    >
                                        {track.name}{" - "}{track.artists.map((artist) => artist.name).join(', ')}
                                    </SelectGroup>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className='w-full flex flex-row gap-5'>
                        <div className='w-full'>
                            <Label>Track Name</Label>
                            <Input {...register('track_name')} value={trackName} placeholder='Track Name' onChange={(e) => {
                                setTrackName(e.target.value);
                            }} />
                        </div>
                    </div>
                    <div className='w-full flex flex-row gap-5'>
                        <div className='w-1/2'>
                            <Label>Track Popularity</Label>
                            <Input type="number" {...register('track_popularity')} value={trackPopularity} onChange={(e) => {
                                setTrackPopularity(parseInt(e.target.value));
                            }} />
                        </div>
                        <div className='w-1/2'>
                            <Label>Track Duration (ms)</Label>
                            <Input type="number" {...register('track_duration_ms')} value={trackDurationMs} onChange={(e) => {
                                setTrackDurationMs(parseInt(e.target.value));
                            }} />
                        </div>
                    </div>
                    <div className='w-full'>
                        <Label>Track Music File</Label>
                        <MusicUpload
                            value={trackFile}
                            onChange={(url: string) => {
                                setTrackFile(url);
                                setValue('track_file', url);
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