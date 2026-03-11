import type { RequestHandler } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "#lib";
import crypto from "crypto";
import type { UploadMimeType, UploadType } from "#schema";

export const uploadPresign: RequestHandler = async (req, res) => {
  // Check that we do have a bucket set in the env
  const r2Bucket = process.env.R2_BUCKET;
  if (!r2Bucket) {
    console.log("Missing R2_BUCKET variable in .env file");
    process.exit(1);
  }

  // Define the mimeTypes that will be accepted and define upload folders
  const uploadRules: Record<
    UploadType,
    { allowedTypes: UploadMimeType[]; folder: string }
  > = {
    avatar: {
      allowedTypes: ["image/jpeg", "image/png", "image/webp"],
      folder: "avatars",
    },
    eventImage: {
      allowedTypes: ["image/jpeg", "image/png", "image/webp"],
      folder: "events",
    },
    artistImage: {
      allowedTypes: ["image/jpeg", "image/png", "image/webp"],
      folder: "artists",
    },
  };

  // Check that the request is matching a rule
  const requestedUploadType: UploadType = req.body.uploadType;
  const requestedMimeType: UploadMimeType = req.body.mimeType;
  const matchedRule = uploadRules[requestedUploadType];

  if (!matchedRule.allowedTypes.includes(requestedMimeType)) {
    throw new Error(`MimeType is not allowed by uploadRule`, {
      cause: { status: 404 },
    });
  }

  // Create random image key
  const mimeTypeFileTypeMapping = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  const id = crypto.randomUUID();
  const fileSuffix = mimeTypeFileTypeMapping[requestedMimeType];
  const folder = uploadRules[requestedUploadType].folder;

  const key = `uploads/${folder}/${id}.${fileSuffix}`;

  const command = new PutObjectCommand({
    Bucket: r2Bucket,
    Key: key,
    ContentType: requestedMimeType,
  });

  const url = await getSignedUrl(r2(), command, {
    expiresIn: 60,
  });

  res.json({
    uploadUrl: url,
    key,
  });
};
