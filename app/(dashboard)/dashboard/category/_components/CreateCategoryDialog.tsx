'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, SelectContent, SelectGroup, SelectTrigger } from '@/components/ui/select';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Artist, Album, Track, Playlist } from '@prisma/client';
import { categoryData } from '@/data/category';

interface Props {
    trigger: React.ReactNode;
}

export default function CreateCategoryDialog({ trigger }: Props) {
    const [open, setOpen] = useState(false);
    const [queryArtist, setQueryArtist] = useState('');
    const [queryAlbum, setQueryAlbum] = useState('');
    const [queryTrack, setQueryTrack] = useState('');
    const [queryPlaylist, setQueryPlaylist] = useState('');
    const [pending, setPending] = useState(false);

    const [categoryName, setCategoryName] = useState<string>('');

    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const [selectedArtists, setSelectedArtists] = useState<Artist[]>([]);
    const [selectedAlbums, setSelectedAlbums] = useState<Album[]>([]);
    const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
    const [selectedPlaylists, setSelectedPlaylists] = useState<Playlist[]>([]);

    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<FieldValues>({
        defaultValues: {},
    });

    const artists = useQuery<Artist[]>({
        queryKey: ['artist'],
        queryFn: () => fetch('/api/music/artist').then((res) => res.json()),
    });

    const albums = useQuery<Album[]>({
        queryKey: ['album'],
        queryFn: () => fetch('/api/music/album').then((res) => res.json()),
    });

    const tracks = useQuery<Track[]>({
        queryKey: ['track'],
        queryFn: () => fetch('/api/music/track').then((res) => res.json()),
    });

    const playlists = useQuery<Playlist[]>({
        queryKey: ['playlist'],
        queryFn: () => fetch('/api/music/playlist').then((res) => res.json()),
    });

    useEffect(() => {
        if (selectedCategory === 'artists') {
            setValue('category_type', selectedCategory);
            setValue('category_artists_id', selectedArtists.map(artist => artist.artist_id));
            setValue('category_artists_saved_id', selectedArtists.map(artist => artist.artist_saved_id));
        } else if (selectedCategory === 'albums') {
            setValue('category_type', selectedCategory);
            setValue('category_albums_id', selectedAlbums.map(album => album.album_id));
            setValue('category_albums_saved_id', selectedAlbums.map(album => album.album_saved_id));
        } else if (selectedCategory === 'tracks') {
            setValue('category_type', selectedCategory);
            setValue('category_tracks_id', selectedTracks.map(track => track.track_id));
            setValue('category_tracks_saved_id', selectedTracks.map(track => track.track_saved_id));
        } else if (selectedCategory === 'playlists') {
            setValue('category_type', selectedCategory);
            setValue('category_playlists_id', selectedPlaylists.map(playlist => playlist.playlist_id));
            setValue('category_playlists_saved_id', selectedPlaylists.map(playlist => playlist.playlist_saved_id));
        }
    }, [setValue, selectedCategory, selectedArtists, selectedAlbums, selectedTracks, selectedPlaylists]);

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        if (pending) return;

        setPending(true);

        try {
            const formattedData = {
                ...data
            };
            console.log(formattedData);
            await axios.post('/api/category', formattedData);
            toast.success('Category created successfully!');
            reset();
            setOpen(false);
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            toast.error('Failed to create category.');
        } finally {
            setPending(false);
        }
    };

    const handleArtistSelection = (artist: Artist) => {
        const isSelected = selectedArtists.some(a => a.artist_id === artist.artist_id);
        if (isSelected) {
            setSelectedArtists(selectedArtists.filter(a => a.artist_id !== artist.artist_id));
        } else {
            setSelectedArtists([...selectedArtists, artist]);
        }
    };

    const handleAlbumSelection = (album: Album) => {
        const isSelected = selectedAlbums.some(a => a.album_id === album.album_id);
        if (isSelected) {
            setSelectedAlbums(selectedAlbums.filter(a => a.album_id !== album.album_id));
        } else {
            setSelectedAlbums([...selectedAlbums, album]);
        }
    };

    const handleTrackSelection = (track: Track) => {
        const isSelected = selectedTracks.some(a => a.track_id === track.track_id);
        if (isSelected) {
            setSelectedTracks(selectedTracks.filter(a => a.track_id !== track.track_id));
        } else {
            setSelectedTracks([...selectedTracks, track]);
        }
    };

    const handlePlaylistSelection = (playlist: Playlist) => {
        const isSelected = selectedPlaylists.some(a => a.playlist_id === playlist.playlist_id);
        if (isSelected) {
            setSelectedPlaylists(selectedPlaylists.filter(a => a.playlist_id !== playlist.playlist_id));
        } else {
            setSelectedPlaylists([...selectedPlaylists, playlist]);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-full flex flex-row gap-5">
                        <div className="w-full">
                            <Label>Category Name</Label>
                            <Input
                                {...register('category_name')}
                                value={categoryName}
                                placeholder="Category Name"
                                onChange={(e) => setCategoryName(e.target.value)}
                            />
                        </div>
                    </div>
                    <Select>
                        <SelectTrigger>
                            <Input
                                type="text"
                                readOnly
                                value={selectedCategory ? selectedCategory : "Select category"}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {categoryData.map(item => (
                                <SelectGroup
                                    key={item.id}
                                    className="cursor-pointer"
                                    onClick={() => setSelectedCategory(item.name)}
                                >
                                    {item.name}
                                </SelectGroup>
                            ))}
                        </SelectContent>
                    </Select>
                    {selectedCategory === "artists" && artists.data && artists.data.length > 0 && (
                        <div className="flex flex-row gap-5">
                            <div className="w-1/2">
                                <Input
                                    type="text"
                                    value={queryArtist}
                                    onChange={(e) => setQueryArtist(e.target.value)}
                                    placeholder="Search for artist"
                                />
                            </div>
                            <div className="w-1/2">
                                <Select>
                                    <SelectTrigger>
                                        <Input
                                            type="text"
                                            readOnly
                                            value={selectedArtists.length > 0 ? `${selectedArtists.length} artists selected` : "Select artist"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {artists.data.map(artist => (
                                            <SelectGroup
                                                key={artist.artist_id}
                                                className={`cursor-pointer ${selectedArtists.some(a => a.artist_id === artist.artist_id) ? 'bg-blue-200' : ''}`}
                                                onClick={() => handleArtistSelection(artist)}
                                            >
                                                {artist.artist_name}
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    {selectedCategory === "albums" && albums.data && albums.data.length > 0 && (
                        <div className="flex flex-row gap-5">
                            <div className="w-1/2">
                                <Input
                                    type="text"
                                    value={queryAlbum}
                                    onChange={(e) => setQueryAlbum(e.target.value)}
                                    placeholder="Search for album"
                                />
                            </div>
                            <div className="w-1/2">
                                <Select>
                                    <SelectTrigger>
                                        <Input
                                            type="text"
                                            readOnly
                                            value={selectedAlbums.length > 0 ? `${selectedAlbums.length} albums selected` : "Select album"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {albums.data.map(album => (
                                            <SelectGroup
                                                key={album.album_id}
                                                className={`cursor-pointer ${selectedAlbums.some(a => a.album_id === album.album_id) ? 'bg-blue-200' : ''}`}
                                                onClick={() => handleAlbumSelection(album)}
                                            >
                                                {album.album_name}
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    {selectedCategory === "tracks" && tracks.data && tracks.data.length > 0 && (
                        <div className="flex flex-row gap-5">
                            <div className="w-1/2">
                                <Input
                                    type="text"
                                    value={queryTrack}
                                    onChange={(e) => setQueryTrack(e.target.value)}
                                    placeholder="Search for track"
                                />
                            </div>
                            <div className="w-1/2">
                                <Select>
                                    <SelectTrigger>
                                        <Input
                                            type="text"
                                            readOnly
                                            value={selectedTracks.length > 0 ? `${selectedTracks.length} tracks selected` : "Select track"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tracks.data.map(track => (
                                            <SelectGroup
                                                key={track.track_id}
                                                className={`cursor-pointer ${selectedTracks.some(a => a.track_id === track.track_id) ? 'bg-blue-200' : ''}`}
                                                onClick={() => handleTrackSelection(track)}
                                            >
                                                {track.track_name}
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    {selectedCategory === "playlists" && playlists.data && playlists.data.length > 0 && (
                        <div className="flex flex-row gap-5">
                            <div className="w-1/2">
                                <Input
                                    type="text"
                                    value={queryPlaylist}
                                    onChange={(e) => setQueryPlaylist(e.target.value)}
                                    placeholder="Search for playlist"
                                />
                            </div>
                            <div className="w-1/2">
                                <Select>
                                    <SelectTrigger>
                                        <Input
                                            type="text"
                                            readOnly
                                            value={selectedPlaylists.length > 0 ? `${selectedPlaylists.length} playlists selected` : "Select playlist"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {playlists.data.map(playlist => (
                                            <SelectGroup
                                                key={playlist.playlist_id}
                                                className={`cursor-pointer ${selectedPlaylists.some(a => a.playlist_id === playlist.playlist_id) ? 'bg-blue-200' : ''}`}
                                                onClick={() => handlePlaylistSelection(playlist)}
                                            >
                                                {playlist.playlist_name}
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <DialogClose>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={pending}>
                            {pending && <Loader className="shrink-0 h-4 w-4 mr-2 animate-spin" />}
                            {pending ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
