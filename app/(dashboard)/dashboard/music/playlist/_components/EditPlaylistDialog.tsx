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
import { Playlist } from '@prisma/client';

interface Props {
    trigger: React.ReactNode;
    playlist: Playlist
}

export default function EditPlaylistDialog({ trigger, playlist }: Props) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [pending, setPending] = useState(false);

    const [playlistName, setPlaylistName] = useState<string>(playlist.playlist_name);
    const [playlistDescription, setPlaylistDescription] = useState<string>(playlist.playlist_description || '');
    const [playlistImages, setPlaylistImages] = useState<string[]>(playlist.playlist_images || []);
    const [playlistFollowers, setPlaylistFollowers] = useState<string>(playlist.playlist_followers || '');

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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Playlist</DialogTitle>
                </DialogHeader>
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
                            onChange={(e) => {
                                setPlaylistImages(e);
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