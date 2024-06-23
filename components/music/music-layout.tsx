import { ReactNode } from 'react';
import MusicPlayer from './music-player';

interface MusicLayoutProps {
    children: ReactNode;
}

export default function MusicLayout({ children }: MusicLayoutProps) {
    return (
        <>
            <div>
                {children}
            </div>
            <MusicPlayer />
        </>
    );
}
