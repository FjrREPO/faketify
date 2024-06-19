import prisma from "@/lib/prisma/prisma";

export type getUserType = Awaited<ReturnType<typeof getUserById>>

export const getUserById = (user_id: any) => {
    const user = prisma.user.findMany({
        where: {
            id: user_id
        }
    })
    return Response.json(user)
}