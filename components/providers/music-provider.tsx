import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Track } from '@prisma/client';

interface MusicPlayerContextProps {
    currentTrack: Track | null;
    setCurrentTrack: (track: Track | null) => void;
    isPlaying: boolean;
    playTrack: () => void;
    pauseTrack: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextProps | undefined>(undefined);

export const useMusicPlayer = () => {
    const context = useContext(MusicPlayerContext);
    if (context === undefined) {
        throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
    }
    return context;
};

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const playTrack = () => setIsPlaying(true);
    const pauseTrack = () => setIsPlaying(false);

    return (
        <MusicPlayerContext.Provider
            value={{ currentTrack, setCurrentTrack, isPlaying, playTrack, pauseTrack }}
        >
            {children}
        </MusicPlayerContext.Provider>
    );
};
