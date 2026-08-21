import { NextRequest } from "next/server";

import { auth } from "@/server/modules/auth/auth";

import {
    abandonInterview,
} from "@/server/modules/interview/interview.abandon.service";

import {
    createRouteHandler,
} from "@/server/shared/http/route";

import {
    ok,
} from "@/server/shared/http/response";

import {
    UnauthorizedError,
} from "@/server/shared/errors/errors";


export const POST = createRouteHandler(
    async (
        _request: NextRequest,
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

        const result =
            await abandonInterview({
                sessionId: id,
            });

        return ok(result);
    }
);