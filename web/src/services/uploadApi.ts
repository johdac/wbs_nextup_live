import { eventsApi } from "./events.services";

export interface UploadKey {
  key: string;
  uploadUrl: string;
}

type UploadType = "avatar" | "eventImage" | "artistImage";

export async function uploadFile(file: File, uploadType: UploadType) {
  const { data } = await eventsApi.post<UploadKey>("/upload/presign", {
    uploadType,
    mimeType: file.type,
  });

  // Upload file to R2
  const uploadRes = await fetch(data.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error("Upload failed");
  }
  return data.key;
}
