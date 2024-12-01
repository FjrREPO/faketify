import { RoleGate } from "@/components/auth/role-gate";
import NavbarDashboard from "@/components/bar/navbar-dashboard";
import { currentUser } from "@/lib/auth/auth";
import { UserRole } from "@prisma/client";
import React from "react";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser() as {
        image: string | null;
        name: string | null;
        id: string;
        email: string | null;
        emailVerified: Date | null;
        password: string | null;
        role: UserRole;
        isTwoFactorEnabled: boolean;
        isOAuth: boolean;
    };
    return (
        <RoleGate allowedRole={UserRole.ADMIN}>
            <main className="relative flex flex-col h-screen w-full">
                {user && <NavbarDashboard users={user} />}
                <div className="w-full">{children}</div>
            </main>
        </RoleGate>
    );
}
