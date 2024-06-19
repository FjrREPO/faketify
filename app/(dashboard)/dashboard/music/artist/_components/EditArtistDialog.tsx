"use client";

import { useState} from 'react';
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
import { Artist } from '@prisma/client';

interface Props {
    artist: Artist;
    trigger: React.ReactNode;
}

export default function EditArtistDialog({ artist, trigger }: Props) {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);

    const [artistName, setArtistName] = useState<string>(artist.artist_name);
    const [artistPopularity, setArtistPopularity] = useState<number>(artist.artist_popularity || 0);
    const [artistFollowers, setArtistFollowers] = useState<number>(artist.artist_followers || 0);
    const [artistImages, setArtistImages] = useState<string[]>(artist.artist_images || []);
    const [artistGenres, setArtistGenres] = useState<string[]>(artist.artist_genres || []);

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
                artistName: artistName,
                artistPopularity: artistPopularity,
                artistFollowers: artistFollowers,
                artistImages: artistImages,
                artistGenres: artistGenres
            };
            await axios.post(`/api/music/artist/${artist.artist_id}`, formattedData);
            toast.success('Artist created successfully!');
            reset();
            setOpen(false);
            window.location.reload()
        } catch (error) {
            toast.error('Failed to create artist.');
        } finally {
            setPending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Artist</DialogTitle>
                </DialogHeader>
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
