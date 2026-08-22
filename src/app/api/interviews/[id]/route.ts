import { NextRequest } from "next/server";
import { auth } from "@/server/modules/auth/auth";
import { createRouteHandler } from "@/server/shared/http/route";
import { ok } from "@/server/shared/http/response";
import { UnauthorizedError } from "@/server/shared/errors/errors";
import { getInterviewDetail, deleteInterview } from "@/server/modules/interview/interview.history.service";

export const GET = createRouteHandler(
    async (_request: NextRequest, context: any) => {
        const session = await auth();

        if (!session?.user?.id) {
            throw new UnauthorizedError("Authentication required.");
        }

        const { id } = await context.params;

        const result = await getInterviewDetail({
            userId: session.user.id,
            sessionId: id,
        });

        return ok(result);
    }
);

export const DELETE = createRouteHandler(
    async (_request: NextRequest, context: any) => {
        const session = await auth();

        if (!session?.user?.id) {
            throw new UnauthorizedError("Authentication required.");
        }

        const { id } = await context.params;

        const result = await deleteInterview({
            userId: session.user.id,
            sessionId: id,
        });

        return ok(result);
    }
);