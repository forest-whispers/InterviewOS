import { NextRequest } from "next/server";

import { createRouteHandler } from "@/server/shared/http/route";
import { created } from "@/server/shared/http/response";

import { signUpSchema } from "@/server/modules/auth/auth.validation";
import { signUp } from "@/server/modules/auth/auth.service";
import { parseBody } from "@/server/shared/http/parseBody";

export const POST = createRouteHandler(
    async (request: NextRequest) => {

        const dto = await parseBody(request, signUpSchema);

        const user = await signUp(dto);

        return created({
            message: "Account created successfully.",

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    }
);