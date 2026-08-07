import { NextRequest } from "next/server";

import { auth } from "@/server/modules/auth/auth";

import { createRouteHandler } from "@/server/shared/http/route";
import { created } from "@/server/shared/http/response";

import { UnauthorizedError } from "@/server/shared/errors/errors";

import { uploadResume } from "@/server/modules/resume/resume.service";

/*
 * NOTE
 * Next.js Route Handlers cannot use parseBody()
 * for multipart/form-data.
 * We must read FormData directly.
 */

export const POST = createRouteHandler(
    async (request: NextRequest) => {
        const session = await auth();

        if (!session?.user?.id) {
            throw new UnauthorizedError(
                "Authentication required."
            );
        }

        const formData = await request.formData();

        const file = formData.get("resume");

        if (!(file instanceof File)) {
            throw new UnauthorizedError(
                "Resume file is required."
            );
        }

        const buffer = Buffer.from(
            await file.arrayBuffer()
        );

        const result = await uploadResume({
            userId: session.user.id,

            file: {
                fieldName: "resume",
                originalName: file.name,
                mimeType: file.type,
                size: file.size,
                buffer,
            }

            // file: {
            //     fieldName: "resume",

            //     originalName: file.name,

            //     encoding: "",

            //     mimeType: file.type,

            //     size: file.size,

            //     buffer,

            //     stream: undefined as any,

            //     destination: "",

            //     filename: "",

            //     path: "",
            // },
        });

        return created({
            message:
                "Resume uploaded successfully.",

            resume: result,
        });
    }
);