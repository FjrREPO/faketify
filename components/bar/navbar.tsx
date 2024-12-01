'use client'

import { useEffect, useState } from 'react';
import { ThemeToggle } from '../theme/theme-toggle';
import UserButton from '../auth/user-button';
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';

export default function Navbar() {
  return (
    <>
      <DesktopNavbar />
    </>
  );
}

function DesktopNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const canGoBack = pathname !== '/';

  const [isSelected, setIsSelected] = useState('all');

  const handleSelectFilter = (filter: any) => {
    setIsSelected((prevSelected) => (prevSelected === filter ? 'all' : filter));
  };

  const handleClickBack = () => {
    if (canGoBack) {
      router.back();
    }
  }

  const handleClickNext = () => {
    router.forward();
  }

  return (
    <div className="flex flex-col w-full px-1 gap-5">
      <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-row items-center gap-2'>
          <Button onClick={handleClickBack} className={`w-fit h-fit rounded-full p-0 cursor-pointer ${canGoBack ? 'text-white' : 'text-textsecondary hover:text-textsecondary cursor-not-allowed'}`} variant={'ghost'}>
            <GoChevronLeft className={`w-9 h-9 rounded-full p-1`} />
          </Button>
          <Button onClick={handleClickNext} className='w-fit h-fit rounded-full p-0' variant={'ghost'}>
            <GoChevronRight className='w-9 h-9 rounded-full p-1 text-white' />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
      {
        !canGoBack && (
          <div className='flex flex-row gap-3'>
            <Button onClick={() => handleSelectFilter('all')} className={`rounded-full p-0 px-3 h-8 ${isSelected === 'all' ? 'bg-white' : 'bg-white/10 hover:bg-white/25 text-white'}`} variant={'default'}>
              All
            </Button>
            <Button onClick={() => handleSelectFilter('music')} className={`rounded-full p-0 px-3 h-8 ${isSelected === 'music' ? 'bg-white' : 'bg-white/10 hover:bg-white/25 text-white'}`} variant={'default'}>
              Music
            </Button>
          </div>
        )
      }
    </div>
  );
}
