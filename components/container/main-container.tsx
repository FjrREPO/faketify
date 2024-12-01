'use client'

import { useEffect, useRef, useState } from "react";
import Navbar from "../bar/navbar";
import SidebarComponent from "../bar/sidebar";

export default function MainContainer({ children }: { children: React.ReactNode }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const scrollTop = containerRef.current.scrollTop;
                if (scrollTop > 0) {
                    setIsScrolled(true);
                } else {
                    setIsScrolled(false);
                }
            }
        };

        if (containerRef.current) {
            containerRef.current.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (containerRef.current) {
                containerRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    return (
        <div className="w-screen h-screen isolate p-2 overflow-hidden">
            <div className="main-container gap-2">
                <div className="leftside z-50 w-[18vw] min-w-[250px] max-h-screen">
                    <div className="h-auto w-full">
                        <SidebarComponent />
                    </div>
                </div>
                <div className="rightside w-full h-full relative">
                    <div ref={containerRef} className="z-20 w-full absolute overflow-y-auto h-full rounded-lg pb-10">
                        <header
                            id="navbar"
                            className={`sticky top-0 right-0 w-full pl-5 pr-2 py-3 z-40 ${isScrolled ? 'bg-card' : 'bg-transparent'} transition-colors duration-500 ease-in-out`}
                        >
                            <Navbar />
                        </header>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}