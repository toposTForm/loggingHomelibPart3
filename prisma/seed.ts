import { PrismaClient } from "@prisma/client"
import { User } from '../src/interface'
// import { PrismaClient } from 'generated/prisma/client';
export const prisma = new PrismaClient();


export async function createUser(user: User) {
    try {
        const userCreate = await prisma.user.create({
            data: {
                id: user.id,
                login: user.login,
                password: user.password,
                version: user.version,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
    })
    } catch (error) {
        console.log(error)
    }
}


try {
    prisma.$connect;
} catch (error) {
    console.log(error);
    process.exit(1);
} finally{
    prisma.$disconnect;
};