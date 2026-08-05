import { prisma } from "@/server/config/db";

import { SignUpDto } from "./auth.types";
import { comparePassword, hashPassword } from "./password";
import { ConflictError } from "@/server/shared/errors/errors";

export async function signUp(dto: SignUpDto) {
    const existing = await prisma.user.findUnique({
        where: {
            email: dto.email,
        },
    });

    if (existing) {
        throw new ConflictError("Email already exists.");
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await prisma.user.create({
        data: {
            name: dto.name,
            email: dto.email,
            passwordHash,

            candidate: {
                create: {},
            },
        },
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
    };
}

export async function authenticateUser(
    email: string,
    password: string
) {

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        return null;
    }

    const isValid = await comparePassword(
        password as string,
        user.passwordHash
    );

    if (!isValid) {
        return null;
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
    };
}