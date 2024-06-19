'use client'

import Link from 'next/link';
import Logo from './logo';
import { Label } from '../ui/label';
import { FiSearch } from "react-icons/fi";
import { Home } from 'lucide-react';
import { usePathname } from "next/navigation";
import { Separator } from '../ui/separator';
import { useState } from 'react';
import { useTheme } from 'next-themes';

export default function SidebarComponent() {
    const pathname = usePathname();
    const { theme, resolvedTheme } = useTheme();

    const isDarkMode = theme === 'dark' || resolvedTheme === 'dark';

    const [isHovered, setIsHovered] = useState(false);

    const isActive = (link: string) => {
        return pathname === link;
    };

    const handleHover = () => {
        setIsHovered(true);
    };

    const handleLeave = () => {
        setIsHovered(false);
    };

    return (
        <div className='flex flex-row h-full w-auto'>
            <div className="flex flex-col h-full gap-5 w-[250px]">
                <div>
                    <Logo />
                </div>
                <div className='flex flex-col gap-3'>
                    <Link href={'/'} className={`flex flex-row w-full h-fit gap-5 cursor-pointer items-center ${isActive('/') ? 'active' : ''}`}>
                        <Home className='w-6 h-6' fill={isActive('/') ? (isDarkMode ? 'white' : 'black') : 'none'} />
                        <Label className='text-lg h-fit pt-1 cursor-pointer'>Home</Label>
                    </Link>
                    <Link href={'/search'} className={`flex flex-row w-full h-fit gap-5 cursor-pointer items-center ${isActive('/search') ? 'active' : ''}`}>
                        <FiSearch className='w-6 h-6' fill={isActive('/search') ? (isDarkMode ? 'white' : 'black') : 'none'} />
                        <Label className='text-lg h-fit pt-1 cursor-pointer'>Search</Label>
                    </Link>
                </div>
            </div>
            <div
                className='w-[10px] cursor-grab gethover'
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}
            >
                <Separator
                    orientation="vertical"
                    className={`w-[2px] cursor-grab bg-gray-300 dark:bg-white ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}
                />
            </div>
        </div>
    );
}

