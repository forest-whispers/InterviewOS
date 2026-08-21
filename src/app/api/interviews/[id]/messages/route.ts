import { NextRequest } from "next/server";
import { auth } from "@/server/modules/auth/auth";
import { createRouteHandler } from "@/server/shared/http/route";
import { getQuery } from "@/server/shared/http/query";
import { ok } from "@/server/shared/http/response";
import { UnauthorizedError } from "@/server/shared/errors/errors";
import { getMessagesQuerySchema } from "@/server/modules/interview/interview.validation";
import { getInterviewMessages } from "@/server/modules/interview/interview.history.service";

export const GET = createRouteHandler(
    async (request: NextRequest, context: any) => {
        const session = await auth();

        if (!session?.user?.id) {
            throw new UnauthorizedError("Authentication required.");
        }

        const { id } = await context.params;

        const queryParams = getQuery(request);
        const validatedQuery = getMessagesQuerySchema.parse(queryParams);

        const result = await getInterviewMessages({
            userId: session.user.id,
            sessionId: id,
            page: validatedQuery.page,
            limit: validatedQuery.limit,
        });

        return ok(result);
    }
);