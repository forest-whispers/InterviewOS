import { NextRequest } from "next/server";

import { auth } from "@/server/modules/auth/auth";

import { parseBody } from "@/server/shared/http/parseBody";

import { createRouteHandler } from "@/server/shared/http/route";

import { created } from "@/server/shared/http/response";

import { UnauthorizedError } from "@/server/shared/errors/errors";

import { createInterviewSchema } from "@/server/modules/interview/interview.validation";

import { createInterview } from "@/server/modules/interview/interview.start.service";

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