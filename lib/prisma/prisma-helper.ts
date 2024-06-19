import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getUserRole(userId: string) {
    try {
        if (userId === null) {
            return null;
        }

        const userRole = await prisma.user.findUnique({
            where: { id: userId },
        });

        return userRole?.role
    } catch (error) {
        console.error("Error retrieving user role:", error);
        return null;
    }
}

