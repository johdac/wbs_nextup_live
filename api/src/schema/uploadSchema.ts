import z from "zod";

export const uploadTypeSchema = z.enum(
  ["avatar", "eventImage", "artistImage"],
  {
    message: "Invalid uploadType provided",
  },
);
export type UploadType = z.infer<typeof uploadTypeSchema>;

export const uploadMimeTypeSchema = z.enum(
  ["image/jpeg", "image/png", "image/webp"],
  {
    message: "Invalid mimeType provided",
  },
);
export type UploadMimeType = z.infer<typeof uploadMimeTypeSchema>;

export const uploadPresignBodySchema = z.strictObject({
  uploadType: uploadTypeSchema,
  mimeType: uploadMimeTypeSchema,
});
