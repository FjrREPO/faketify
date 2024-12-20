"use client";

import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./logo";
import { ThemeToggle } from "../theme/theme-toggle";
import { Button, buttonVariants } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import UserButton from "../auth/user-button";
import { User } from "@prisma/client";

type NavbarItemProps = {
    label: string;
    link: string;
};

const items = [
    { label: "Category", link: "/dashboard/category" },
    { label: "Artist", link: "/dashboard/music/artist" },
    { label: "Album", link: "/dashboard/music/album" },
    { label: "Track", link: "/dashboard/music/track" },
    { label: "Playlist", link: "/dashboard/music/playlist" },
];

export default function NavbarDashboard({ users }: { users: User }) {
    const filteredItems = users.role === 'ADMIN' ? items : items.filter(item => item.label !== "Users");

    return (
        <>
            <DesktopNavbar items={filteredItems} />
            <MobileNavbar items={filteredItems} />
        </>
    );
}

function MobileNavbar({ items }: { items: NavbarItemProps[] }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="block border-separate bg-background md:hidden">
            <nav className="container flex items-center justify-between px-8">
                <Sheet
                    open={isOpen}
                    onOpenChange={setIsOpen}
                >
                    <SheetTrigger asChild>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                        >
                            <Menu className="w-8 h-8 shrink-0" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        className="w-[400px] sm:w-[540px]"
                        side={"left"}
                    >
                        <>
                            <Logo />
                            <div className="flex flex-col gap-1 pt-4">
                                {items.map((item: NavbarItemProps) => (
                                    <NavbarItem
                                        key={item.label}
                                        link={item.link}
                                        label={item.label}
                                        clickCallback={() => setIsOpen(false)}
                                    />
                                ))}
                            </div>
                        </>
                    </SheetContent>
                </Sheet>
                <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
                    <Logo />
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <UserButton />
                </div>
            </nav>
        </div>
    );
}

function DesktopNavbar({ items }: { items: NavbarItemProps[] }) {
    return (
        <div className="hidden border-separate border-b bg-background md:block">
            <nav className="container flex items-center justify-between gap-x-4">
                <Logo />
                <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
                    <div className="flex h-full gap-x-2">
                        {items.map((item) => (
                            item.label === 'Payment' ?
                                (
                                    <DropdownMenu key={item.label}>
                                        <DropdownMenuTrigger asChild>
                                            <div className="relative flex items-center">
                                                <Button
                                                    variant={"ghost"}
                                                    className="w-full gap-2 justify-end text-lg text-muted-foreground hover:text-foreground"
                                                >
                                                    {item.label}
                                                </Button>
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-full">
                                            <DropdownMenuItem>
                                                <Link href={`${item.link}`} className="w-full">
                                                    List
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Link href={`${item.link}/method`} className="w-full">
                                                    Method
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="w-full">
                                                <Link href={`${item.link}/plan`}>
                                                    Plan
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Link href={`${item.link}/promo`} className="w-full">
                                                    Promo
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    < NavbarItem
                                        key={item.label}
                                        link={item.link}
                                        label={item.label}
                                    />
                                )
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <UserButton />
                </div>
            </nav>
        </div>
    );
}

function NavbarItem({
    link,
    label,
    clickCallback,
}: {
    link: string;
    label: string;
    clickCallback?: () => void;
}) {
    const pathname = usePathname();
    const isActive = pathname === link;

    return (
        <div className="relative flex items-center">
            <Link
                href={link}
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
                    isActive && "text-foreground"
                )}
                onClick={() => {
                    if (clickCallback) {
                        clickCallback();
                    }
                }}
            >
                {label}
            </Link>
            {isActive && (
                <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl dark:bg-primary bg-emerald-500 md:block" />
            )}
        </div>
    );
}
