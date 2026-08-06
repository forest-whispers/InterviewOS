import cloudinary from "../../config/cloudinary.js";
import { UploadedFile } from "@/server/modules/resume/resume.service.js";

export async function uploadFileToCloudinary(
    file: UploadedFile,
    candidateId: string
) {

    return new Promise<any>((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: `interviewOs/${candidateId}`,
                resource_type: "auto",
                use_filename: false,
                unique_filename: true,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            },
        );

        stream.end(file.buffer);
    });
}

export async function deleteFileFromCloudinary(
    publicId: string,
    resourceType: "image" | "video" | "raw" = "raw",
) {
    return cloudinary.uploader.destroy(
        publicId,
        {
            resource_type: resourceType,
        },
    );
}