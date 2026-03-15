import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "../services/uploadApi";

type UploadType = "avatar" | "eventImage" | "artistImage";

export function useFileUpload(
  uploadType: UploadType,
  initialPreviewUrl?: string,
) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreview(initialPreviewUrl ?? null);
    }
  }, [file, initialPreviewUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxFiles: 1,
    onDrop: (files) => {
      const f = files[0];
      if (!f) return;

      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }

      setFile(f);

      if (f.type.startsWith("image")) {
        const url = URL.createObjectURL(f);
        setPreview(url);
      }
    },
  });

  const upload = async () => {
    if (!file) return null;
    return uploadFile(file, uploadType);
  };

  return {
    file,
    preview,
    getRootProps,
    getInputProps,
    isDragActive,
    upload,
  };
}
