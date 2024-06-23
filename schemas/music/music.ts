import { Track } from '@prisma/client';
import { create } from 'zustand';

interface MusicPlayerState {
    isPlaying: boolean;
    currentTrack: Track | null;
    playTrack: (track: Track) => void;
    pauseTrack: () => void;
    resumeTrack: () => void;
    setTrack: (track: Track) => void;
}

export const useMusicPlayerStore = create<MusicPlayerState>((set) => ({
    isPlaying: false,
    currentTrack: null,
    playTrack: (track) => set(() => ({ isPlaying: true, currentTrack: track })),
    pauseTrack: () => set(() => ({ isPlaying: false })),
    resumeTrack: () => set((state) => ({ isPlaying: true, currentTrack: state.currentTrack })),
    setTrack: (track) => set(() => ({ currentTrack: track, isPlaying: false })),
}));
