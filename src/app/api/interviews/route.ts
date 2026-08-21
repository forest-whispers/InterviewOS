import { NextRequest } from "next/server";

import { auth } from "@/server/modules/auth/auth";

import { parseBody } from "@/server/shared/http/parseBody";

import { createRouteHandler } from "@/server/shared/http/route";

import { created } from "@/server/shared/http/response";

import { UnauthorizedError } from "@/server/shared/errors/errors";

import { createInterviewSchema, getInterviewsQuerySchema } from "@/server/modules/interview/interview.validation";

import { createInterview } from "@/server/modules/interview/interview.start.service";

import { getQuery } from "@/server/shared/http/query";
import { ok } from "@/server/shared/http/response";
import { getCandidateInterviews } from "@/server/modules/interview/interview.history.service";

export const GET = createRouteHandler(
    async (request: NextRequest) => {
        const session = await auth();

        if (!session?.user?.id) {
            throw new UnauthorizedError(
                "Authentication required."
            );
        }

        const queryParams = getQuery(request);
        const validatedQuery = getInterviewsQuerySchema.parse(queryParams);

        const result = await getCandidateInterviews({
            userId: session.user.id,
            page: validatedQuery.page,
            limit: validatedQuery.limit,
            status: validatedQuery.status,
        });

        return ok(result);
    }
);

export const POST = createRouteHandler(
    async (request: NextRequest) => {
        const session = await auth();

        if (!session?.user?.id) {
            throw new UnauthorizedError(
                "Authentication required."
            );
        }

        const dto = await parseBody(
            request,
            createInterviewSchema
        );

        const interview =
            await createInterview({
                userId:
                    session.user.id,

                interviewObjective:
                    dto.interviewObjective,

                topics:
                    dto.topics,
            });

        return created({
            message:
                "Interview created successfully.",

            interview,
        });
    }
);