"use client";

import { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader } from 'lucide-react';
import { Track } from '@prisma/client';
import MusicUpload from '@/components/uploader/music-upload';

interface Props {
    track: Track;
    trigger: React.ReactNode;
}

export default function EditTrackDialog({ track, trigger }: Props) {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);

    const [trackName, setTrackName] = useState<string>(track.track_name);
    const [trackPopularity, setTrackPopularity] = useState<number>(track.track_popularity || 0);
    const [trackDurationMs, setTrackDurationMs] = useState<number>(track.track_duration_ms || 0);
    const [trackFile, setTrackFile] = useState<string>(track.track_file || '');
    const [trackAlbumsId, setAlbumsTracksId] = useState<string[]>(track.track_albums_id ? [track.track_albums_id] : []);
    const [trackArtistsId, setTrackArtistsId] = useState<string[]>(track.track_artists_id || []);

    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<FieldValues>({
        defaultValues: {

        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        if (pending) return;

        setPending(true);

        try {
            const formattedData = {
                ...data,
                track_name: trackName,
                track_popularity: trackPopularity,
                track_duration_ms: trackDurationMs,
                track_file: trackFile,
                track_albums_id: trackAlbumsId,
                track_artists_id: trackArtistsId
            };
            await axios.post(`/api/music/track/${track.track_id}`, formattedData);
            toast.success('Track created successfully!');
            reset();
            setOpen(false);
            window.location.reload()
        } catch (error) {
            toast.error('Failed to create track.');
        } finally {
            setPending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Track</DialogTitle>
                </DialogHeader>
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
                            onChange={(e) => {
                                setTrackFile(e);
                                setValue('track_file', e);
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
