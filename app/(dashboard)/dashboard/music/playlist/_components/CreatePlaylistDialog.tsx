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
import { Artist, Album, Track } from '@prisma/client';

interface Props {
    trigger: React.ReactNode;
}

export default function CreatePlaylistDialog({ trigger }: Props) {
    const [open, setOpen] = useState(false);
    const [queryArtist, setQueryArtist] = useState('');
    const [queryAlbum, setQueryAlbum] = useState('');
    const [queryTrack, setQueryTrack] = useState('');
    const [pending, setPending] = useState(false);

    const [playlistName, setPlaylistName] = useState<string>('');

    const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');

    const [selectedArtists, setSelectedArtists] = useState<Artist[]>([]);
    const [selectedAlbums, setSelectedAlbums] = useState<Album[]>([]);
    const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);

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

    useEffect(() => {
        if (selectedPlaylist === 'artists') {
            setValue('playlist_type', selectedPlaylist);
            setValue('playlist_artists_id', selectedArtists.map(artist => artist.artist_id));
            setValue('playlist_artists_saved_id', selectedArtists.map(artist => artist.artist_saved_id));
        } else if (selectedPlaylist === 'albums') {
            setValue('playlist_type', selectedPlaylist);
            setValue('playlist_albums_id', selectedAlbums.map(album => album.album_id));
            setValue('playlist_albums_saved_id', selectedAlbums.map(album => album.album_saved_id));
        } else if (selectedPlaylist === 'tracks') {
            setValue('playlist_type', selectedPlaylist);
            setValue('playlist_tracks_id', selectedTracks.map(track => track.track_id));
            setValue('playlist_tracks_saved_id', selectedTracks.map(track => track.track_saved_id));
        }
    }, [setValue, selectedPlaylist, selectedArtists, selectedAlbums, selectedTracks]);

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        if (pending) return;

        setPending(true);

        try {
            const formattedData = {
                ...data
            };
            await axios.post('/api/playlist', formattedData);
            toast.success('Playlist created successfully!');
            reset();
            setOpen(false);
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            toast.error('Failed to create playlist.');
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Playlist</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-full flex flex-row gap-5">
                        <div className="w-full">
                            <Label>Playlist Name</Label>
                            <Input
                                {...register('playlist_name')}
                                value={playlistName}
                                placeholder="Playlist Name"
                                onChange={(e) => setPlaylistName(e.target.value)}
                            />
                        </div>
                    </div>
                    <Select>
                        <SelectTrigger>
                            <Input
                                type="text"
                                readOnly
                                value={selectedPlaylist ? selectedPlaylist : "Select playlist"}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {playlistData.map(item => (
                                <SelectGroup
                                    key={item.id}
                                    className="cursor-pointer"
                                    onClick={() => setSelectedPlaylist(item.name)}
                                >
                                    {item.name}
                                </SelectGroup>
                            ))}
                        </SelectContent>
                    </Select>
                    {selectedPlaylist === "artists" && artists.data && artists.data.length > 0 && (
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
                    {selectedPlaylist === "albums" && albums.data && albums.data.length > 0 && (
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
                    {selectedPlaylist === "tracks" && tracks.data && tracks.data.length > 0 && (
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