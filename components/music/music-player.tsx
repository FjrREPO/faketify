import { Artist, Track } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Label } from "../ui/label";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useRef, useState, useEffect } from "react";
import { FaPauseCircle, FaPlayCircle, FaStepBackward , FaStepForward } from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";
import { TbSwitch3 } from "react-icons/tb";

export default function MusicPlayer({ selectedTrack }: { selectedTrack: Track }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [repeatMode, setRepeatMode] = useState(false);
    const audioPlayerRef = useRef<any>(null);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

    const artist: any = useQuery<Artist[]>({
        queryKey: ["artist"],
        queryFn: () =>
            fetch(`/api/music/artist`).then((res) => res.json()),
    });

    const filteredArtist = artist.data && selectedTrack.track_artists_id.length > 0 &&
        artist.data.find((item: any) => selectedTrack.track_artists_id.includes(item.artist_saved_id));

    useEffect(() => {
        setIsPlaying(false);
        setCurrentTrackIndex(0); 
    }, [selectedTrack]);

    const handlePlay = () => {
        if (audioPlayerRef.current) {
            audioPlayerRef.current.audio.current.play();
            setIsPlaying(true);
        }
    };

    const handlePause = () => {
        if (audioPlayerRef.current) {
            audioPlayerRef.current.audio.current.pause();
            setIsPlaying(false);
        }
    };

    const handleSwitch = () => {
    };

    const handleBackward = () => {
    };

    const handleForward = () => {
    };

    const handleRepeat = () => {
        setRepeatMode((prevMode) => !prevMode);
    };

    const handleEnded = () => {
        if (repeatMode) {
            audioPlayerRef.current.audio.current.currentTime = 0;
            audioPlayerRef.current.audio.current.play();
        } else {
            setCurrentTrackIndex((prevIndex) => (prevIndex + 1));
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 w-full h-auto z-50 bg-white dark:bg-black">
            <div className="relative w-full h-full px-5 py-4">
                <div className="grid grid-cols-3 place-items-stretch">
                    <div className="flex flex-row gap-3 items-center">
                        <div className="p-2.5 border-[1px] border-gray-500 rounded-sm w-fit h-fit">
                            <Image src={filteredArtist && filteredArtist.artist_images[0]} alt="image" width={50} height={50} />
                        </div>
                        <div className="flex flex-col items-start justify-center h-full w-auto">
                            <Label className="text-xs">{selectedTrack && selectedTrack.track_name}</Label>
                            <Label className="font-light text-xs text-gray-400">{filteredArtist && filteredArtist.artist_name}</Label>
                        </div>
                    </div>
                    <div className="w-full h-auto flex flex-col justify-center items-center">
                        <div className="flex flex-row justify-center items-center gap-5">
                            <TbSwitch3 className="w-5 h-5 cursor-pointer" onClick={handleSwitch} />
                            <FaStepBackward className="w-5 h-5" onClick={handleBackward} />
                            {isPlaying ? (
                                <FaPauseCircle className="w-8 h-8" onClick={handlePause} />
                            ) : (
                                <FaPlayCircle className="w-8 h-8" onClick={handlePlay} />
                            )}
                            <FaStepForward className="w-5 h-5" onClick={handleForward} />
                            <FaRepeat className={`w-5 h-5 cursor-pointer ${repeatMode ? 'text-blue-500' : ''}`} onClick={handleRepeat} />
                        </div>
                        <AudioPlayer
                            ref={audioPlayerRef}
                            src={selectedTrack && selectedTrack.track_file ? selectedTrack.track_file : ""}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onEnded={handleEnded}
                            autoPlay={false}
                        />
                    </div>
                    <div className="w-full h-auto flex flex-row items-center justify-end">
                        a
                    </div>
                </div>
            </div>
        </div>
    );
}
