import { NextRequest } from "next/server";
import { z } from "zod";

export async function parseBody<T>(
    request: NextRequest,
    schema: z.ZodSchema<T>
): Promise<T> {
    return schema.parse(await request.json());
}