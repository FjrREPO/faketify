'use client'

import Link from 'next/link';
import Logo from './logo';
import { Label } from '../ui/label';
import { FiSearch } from "react-icons/fi";
import { CirclePlus, Home, Plus } from 'lucide-react';
import { usePathname } from "next/navigation";
import { useTheme } from 'next-themes';
import { IoLibrary } from "react-icons/io5";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { PiGlobe } from "react-icons/pi";

export default function SidebarComponent() {
    const pathname = usePathname();
    const { theme, resolvedTheme } = useTheme();

    const isDarkMode = theme === 'dark' || resolvedTheme === 'dark';

    const isActive = (link: string) => {
        return pathname === link;
    };

    return (
        <div className='flex flex-col h-full w-auto gap-2'>
            <div className="flex flex-col h-auto gap-1 w-full bg-card py-5 pl-6 rounded-lg">
                <div>
                    <Logo />
                </div>
                <div className='flex flex-col gap-3 dark:text-textsecondary'>
                    <Link href={'/'} className={`flex flex-row w-full h-fit gap-5 cursor-pointer items-center ${isActive('/') ? 'active' : ''}`}>
                        <Home className='w-6 h-6' />
                        <Label className='text-md h-fit pt-1 cursor-pointer'>Home</Label>
                    </Link>
                    <Link href={'/search'} className={`flex flex-row w-full h-fit gap-5 cursor-pointer items-center ${isActive('/search') ? 'active' : ''}`}>
                        <FiSearch className='w-6 h-6' fill={isActive('/search') ? (isDarkMode ? 'white' : 'black') : 'none'} />
                        <Label className='text-md h-fit pt-1 cursor-pointer'>Search</Label>
                    </Link>
                    <Link href={'/dashboard/music/artist'} className={`flex flex-row w-full h-fit gap-5 cursor-pointer items-center ${isActive('/dashboard/music/artist') ? 'active' : ''}`}>
                        <CirclePlus className='w-6 h-6' fill={isActive('/search') ? (isDarkMode ? 'white' : 'black') : 'none'} />
                        <Label className='text-md h-fit pt-1 cursor-pointer'>Dashboard</Label>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col justify-between max-h-full min-h-full gap-5 w-full bg-card p-5 rounded-lg dark:text-gray-300">
                <div className='flex flex-col gap-5'>
                    <div className='flex flex-row justify-between items-center'>
                        <div className='flex flex-row gap-3 items-center'>
                            <IoLibrary className='text-2xl' /><Label className='pt-2 text-md'>Your Library</Label>
                        </div>
                        <div className='pt-1'>
                            <Plus className='cursor-pointer' />
                        </div>
                    </div>
                    <div className='w-fit max-h-[170px] flex flex-col'>
                        <div className='flex flex-col overflow-y-hidden hover:overflow-y-auto duration-200 gap-5'>
                            <Card className='bg-backgroundsecondary border-0'>
                                <CardHeader className='p-1 pl-6 pt-6'>
                                    <CardTitle className='text-lg'>Create your first playlist</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='flex flex-col gap-5'>
                                        <Label>It's easy, We'll help you</Label>
                                        <Button className='w-fit rounded-full'>Create Playlist</Button>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className='bg-backgroundsecondary border-0'>
                                <CardHeader className='p-1 pl-6 pt-6'>
                                    <CardTitle className='text-lg'>Lets explore some music</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className='flex flex-col gap-5'>
                                        <Label>We'll keep you update on new music</Label>
                                        <Button className='w-fit rounded-full'>Explore</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
                <div className='flex'>
                    <Button variant={'outline'} className='border-0 flex flex-row items-center gap-2 rounded-full'>
                        <PiGlobe className='text-2xl' />
                        <Label className='pt-1 cursor-pointer'>English</Label>
                    </Button>
                </div>
            </div>
        </div>
    );
}

