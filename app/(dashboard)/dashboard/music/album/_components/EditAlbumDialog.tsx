"use client";

import { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import ImageUpload from '@/components/uploader/image-upload';
import { Label } from '@/components/ui/label';
import { Loader } from 'lucide-react';
import { Album } from '@prisma/client';

interface Props {
    album: Album;
    trigger: React.ReactNode;
}

export default function EditAlbumDialog({ album, trigger }: Props) {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);

    const [albumName, setAlbumName] = useState<string>(album.album_name);
    const [albumPopularity, setAlbumPopularity] = useState<number>(album.album_popularity || 0);
    const [albumReleaseDate, setAlbumReleaseDate] = useState<string>(album.album_release_date || '');
    const [albumImages, setAlbumImages] = useState<string[]>(album.album_images || []);
    const [albumTracksId, setAlbumTracksId] = useState<string[]>(album.album_tracks_id || []);
    const [albumArtistsId, setAlbumArtistsId] = useState<string[]>(album.album_artists_id || []);

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
                album_name: albumName,
                album_popularity: albumPopularity,
                album_release_date: albumReleaseDate,
                album_images: albumImages,
                album_tracks_id: albumTracksId,
                album_artists_id: albumArtistsId
            };
            await axios.post(`/api/music/album/${album.album_id}`, formattedData);
            toast.success('Album created successfully!');
            reset();
            setOpen(false);
            window.location.reload()
        } catch (error) {
            toast.error('Failed to create album.');
        } finally {
            setPending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Album</DialogTitle>
                </DialogHeader>
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
                            onChange={(images: string[]) => {
                                setAlbumImages(images);
                                setValue('album_images', images);
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
