import { NextRequest } from "next/server";

import { auth } from "@/server/modules/auth/auth";

import { createRouteHandler } from "@/server/shared/http/route";

import { ok } from "@/server/shared/http/response";

import {
    UnauthorizedError,
} from "@/server/shared/errors/errors";
import { completeInterview } from "@/server/modules/interview/interview.complete.service";

export const POST = createRouteHandler(
    async (
        request: NextRequest,
        context: any
    ) => {
        const session = await auth();

        if (!session?.user?.id) {
            throw new UnauthorizedError(
                "Authentication required."
            );
        }

        const { id } =
            await context.params;

        const artifact =
            await completeInterview({
                sessionId: id,
            });

        return ok({
            evaluation: artifact,
        });
    }
);