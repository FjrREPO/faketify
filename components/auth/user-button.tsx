'use client';

import { CircleUserRound, Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

const UserButton: React.FC = () => {
    const { data: session } = useSession();
    const router = useRouter();

    return (
        <div className="flex gap-4 ml-auto items-center w-full">
            <style jsx>{`
                @keyframes slide-down {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                }
            `}</style>
            {session?.user ? (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={'outline'} className="flex items-center gap-1 rounded-full px-2">
                                <Menu className="pr-2 w-7 h-7" />
                                <Image
                                    src={session.user.image ?? ""}
                                    alt={session.user.name ?? ""}
                                    className="rounded-full"
                                    width={28}
                                    height={28}
                                />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="border shadow-lg rounded-lg mt-2 p-1 w-30animate-slide-down"
                        >
                            <DropdownMenuItem>
                                <button
                                    // onClick={() => profil()}
                                    className="text-sm w-fit p-0.5  p-0 rounded-lg w-full text-left"
                                    type="button"
                                >
                                    Profil
                                </button>
                            </DropdownMenuItem>
                            <DropdownMenuItem >
                                <button
                                    onClick={() => signOut()}
                                    className="text-sm w-fit p-0.5  p-0 rounded-lg w-full text-left"
                                    type="button"
                                >
                                    Sign Out
                                </button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            ) : (
                <Button onClick={() => router.push("/auth/login")} type="button" variant={'outline'} className="w-fit h-[37px]"     >
                    <CircleUserRound className="w-[25px] h-[25px] duration-300" />
                </Button>
            )}
        </div>
    );
};

export default UserButton;
