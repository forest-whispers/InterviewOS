import { env } from "@/server/config/env";
import type { NextAuthConfig } from "next-auth";

export const authOptions: NextAuthConfig = {
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = (user as any).id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    providers: [],
    pages: {
        signIn: "/login",
    },
    trustHost: true,
    secret: env.AUTH_SECRET,
};