import { NextRequest } from "next/server";

import { auth } from "@/server/modules/auth/auth";

import {
    submitAnswer,
} from "@/server/modules/interview/interview.service";

import {
    submitAnswerSchema,
} from "@/server/modules/interview/interview.validation";

import {
    createRouteHandler,
} from "@/server/shared/http/route";

import {
    parseBody
} from "@/server/shared/http/parseBody";

import {
    ok,
} from "@/server/shared/http/response";

import {
    UnauthorizedError,
} from "@/server/shared/errors/errors";

// interface RouteContext {
//     params: Promise<{
//         id: string;
//     }>;
// }

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

        const dto =
            await parseBody(
                request,
                submitAnswerSchema
            );

        const interview =
            await submitAnswer({
                sessionId: id,

                answer: dto.answer,
            });

        return ok(interview);
    }
);