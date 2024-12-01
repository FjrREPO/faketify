'use client'

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { FaPauseCircle, FaPlayCircle, FaStepBackward, FaStepForward } from 'react-icons/fa';
import { FaRepeat } from 'react-icons/fa6';
import { TbSwitch3 } from 'react-icons/tb';
import { LiaMicrophoneAltSolid } from "react-icons/lia";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { useMusicPlayer } from '../providers/music-provider';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from "framer-motion";
import { Label } from '../ui/label';
import { Album, Artist } from '@prisma/client';

export default function MusicPlayer() {
    const { currentTrack, isPlaying, playTrack, pauseTrack } = useMusicPlayer();
    const audioPlayerRef = useRef<AudioPlayer>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [currentParagraph, setCurrentParagraph] = useState(0);

    const handleNextClick = () => {
        setCurrentParagraph(currentParagraph + 1);
    };

    const handlePreviousClick = () => {
        setCurrentParagraph(currentParagraph - 1);
    };

    const handleOpen = () => {
        setIsVisible(true);
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    const artist = useQuery({
        queryKey: ['artist'],
        queryFn: () => fetch(`/api/music/artist`).then((res) => res.json()),
    });

    const album = useQuery({
        queryKey: ['album'],
        queryFn: () => fetch(`/api/music/album`).then((res) => res.json()),
    });

    const findArtist =
        artist.data &&
        currentTrack &&
        artist.data.find((item: Artist) => currentTrack.track_artists_id.includes(item.artist_saved_id ?? ''));

    const findAlbum =
        album.data &&
        currentTrack &&
        album.data.find((item: Album) => currentTrack.track_albums_id?.includes(item.album_saved_id ?? ''));

    useEffect(() => {
        setIsVisible(!!currentTrack);
        setCurrentParagraph(0);
    }, [currentTrack]);

    const handlePlay = () => {
        if (audioPlayerRef.current && currentTrack) {
            audioPlayerRef.current.audio.current?.play();
            playTrack();
        }
    };

    const handlePause = () => {
        if (audioPlayerRef.current) {
            audioPlayerRef.current.audio.current?.pause();
            pauseTrack();
        }
    };

    const lyric = useQuery({
        queryKey: ['lyric', currentTrack?.track_name, findArtist?.artist_name],
        queryFn: async () => {
            if (findArtist && currentTrack) {
                const response = await fetch(`/api/music/lyric?title=${encodeURIComponent(currentTrack.track_name)}&artist=${encodeURIComponent(findArtist.artist_name)}`);
                if (!response.ok) {
                    return ''
                }
                const data = await response.json();
                return data.lyrics;
            } else {
                return '';
            }
        },
        staleTime: Infinity,
        refetchInterval: false,
    });

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-0 left-0 right-0 w-full z-50 bg-white dark:bg-black border-t-[1px] border-gray-200 dark:border-gray-800"
                    >
                        <div className="relative w-full px-5 py-4">
                            <div className="grid grid-cols-3 place-items-stretch">
                                <div className="flex flex-row gap-3 items-center">
                                    {currentTrack && (
                                        <div className="p-2.5 border-[1px] border-gray-500 rounded-sm w-fit h-fit">
                                            <Image
                                                src={findAlbum && findAlbum.album_images[0] ? findAlbum.album_images[0] : ''}
                                                alt="image"
                                                width={50}
                                                height={50}
                                                className="w-[50px] h-[50px] object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex flex-col items-start justify-center h-full w-auto">
                                        {currentTrack && (
                                            <>
                                                <div className="text-xs">{currentTrack.track_name}</div>
                                                <div className="font-light text-xs text-gray-400">
                                                    {findArtist && findArtist.artist_name}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full h-auto flex flex-col justify-center items-center">
                                    <div className="flex flex-row justify-center items-center gap-5">
                                        <TbSwitch3 className="w-5 h-5 cursor-pointer" onClick={() => { }} />
                                        <FaStepBackward className="w-5 h-5 cursor-pointer" onClick={() => { }} />
                                        {isPlaying ? (
                                            <FaPauseCircle
                                                className="w-8 h-8 cursor-pointer"
                                                onClick={handlePause}
                                            />
                                        ) : (
                                            <FaPlayCircle
                                                className="w-8 h-8 cursor-pointer"
                                                onClick={handlePlay}
                                            />
                                        )}
                                        <FaStepForward className="w-5 h-5 cursor-pointer" onClick={() => { }} />
                                        <FaRepeat className={`w-4.5 h-4.5 cursor-pointer`} onClick={() => { }} />
                                    </div>
                                    {currentTrack && (
                                        <AudioPlayer
                                            ref={audioPlayerRef}
                                            src={currentTrack && currentTrack.track_file ? currentTrack.track_file : ''}
                                            onPlay={handlePlay}
                                            onPause={handlePause}
                                            autoPlay={isPlaying}
                                        />
                                    )}
                                </div>
                                <div className="w-full h-auto flex flex-col justify-center items-end">
                                    <div className="flex flex-row justify-center items-center gap-5">
                                        <Dialog>
                                            <DialogTrigger>
                                                <LiaMicrophoneAltSolid className="w-6 h-6 cursor-pointer" />
                                            </DialogTrigger>
                                            <DialogContent className='flex flex-col gap-1 min-h-[300px] justify-between'>
                                                <DialogHeader>
                                                    <DialogTitle className='text-center'>
                                                        {currentTrack && currentTrack.track_name}
                                                    </DialogTitle>
                                                </DialogHeader>
                                                {lyric.data ? (
                                                    <>
                                                        <motion.div
                                                            key={currentParagraph}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: 20 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="text-sm font-light"
                                                        >
                                                            <pre>
                                                                {currentParagraph === 0 ? lyric.data.split('\n\n')[currentParagraph].split('\n').slice(1).join('\n') : lyric.data.split('\n\n')[currentParagraph]}
                                                            </pre>
                                                        </motion.div>
                                                        <div className='flex flex-row justify-center items-center gap-5'>
                                                            {currentParagraph > 0 && (
                                                                <Button onClick={handlePreviousClick} className='w-fit'><ChevronLeft className="w-5 h-5" /></Button>
                                                            )}
                                                            {currentParagraph < lyric.data.split('\n\n').length - 1 && (
                                                                <Button onClick={handleNextClick} className='w-fit'><ChevronRight className="w-5 h-5" /></Button>
                                                            )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Label className='text-center'>Lyric not found</Label>
                                                        <div></div>
                                                    </>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {currentTrack && (
                <div className='absolute bottom-1 right-2 z-50 h-fit w-fit'>
                    {isVisible ? (
                        <Button className='p-0 w-fit h-fit px-2 hover:bg-foreground/10' variant={"ghost"} onClick={handleClose}>
                            <ChevronDown />
                        </Button>
                    ) : (
                        <Button className='p-0 w-fit h-fit px-2 hover:bg-foreground/10' variant={"ghost"} onClick={handleOpen}>
                            <ChevronUp />
                        </Button>
                    )}
                </div>
            )}
        </>
    );
}
