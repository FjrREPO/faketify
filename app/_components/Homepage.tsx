'use client';

import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';
import Link from 'next/link';

const Homepage = () => {
    return (
        <div className='w-full h-full'>
            <h1>Spotify Home</h1>
            <Link href={'/dashboard/music/artist'} className='flex w-fit relative px-10 py-3 bg-blue-500 text-white hover:bg-blue-700 duration-200 rounded-lg'>Buka CRUD</Link>
        </div>
    );
};

export default Homepage;
