import { Track } from '@prisma/client';
import { Play } from 'lucide-react'
import React from 'react'
import { useMusicPlayer } from '../providers/music-provider';

export default function MusicPlayButton({ track }: { track: Track }) {
    const { setCurrentTrack } = useMusicPlayer();

    const handleTrackSelect = (track: Track) => {
        setCurrentTrack(track);
    };
    
    return (
        <button onClick={() => handleTrackSelect(track)} className="flex w-12 h-12 bg-backgroundSpotify/90 items-center justify-center rounded-full duration-200 hover:scale-105 hover:bg-backgroundSpotify">
            <Play className="text-black p-0.5" fill="black" />
        </button>
    )
}
