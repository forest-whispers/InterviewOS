import pdfParse from "pdf-parse";
import { UploadedFile } from "@/server/modules/resume/resume.service";

import {
    BadRequestError,
    InternalServerError,
} from "@/server/shared/errors/errors";

export async function extractPdfText(
    file: UploadedFile
): Promise<string> {
    if (!file.buffer) {
        throw new BadRequestError(
            "Resume file is missing."
        );
    }

    try {
        const pdf = await pdfParse(file.buffer);

        return pdf.text.trim();
    } catch {
        throw new InternalServerError(
            "Failed to extract text from resume."
        );
    }
}