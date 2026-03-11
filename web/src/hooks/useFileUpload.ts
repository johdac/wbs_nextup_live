import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "../services/uploadApi";

type UploadType = "avatar" | "eventImage" | "artistImage";

export function useFileUpload(uploadType: UploadType) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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

// import { useState } from "react";
// import { useDropzone } from "react-dropzone";
// import { uploadFile } from "../../services/uploadFile";

// export const FileUpload = () => {
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [fileUpload, setFileUpload] = useState<File | null>(null);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     // Remove old preview image if it existed
//     if (imagePreview) URL.revokeObjectURL(imagePreview);

//     setFileUpload(file);

//     if (file.type.includes("image")) {
//       const url = URL.createObjectURL(file);
//       setImagePreview(url);
//     }
//   };

//   const handleFileSubmission = async () => {
//     if (!fileUpload) return;
//     const key = await uploadFile(fileUpload, "artistImage");
//     console.log(key);
//   };

//   return (
//     <>
//       <input
//         accept="image/*"
//         type="file"
//         onChange={handleFileChange}
//         onSubmit={handleFileSubmission}
//       />
//       {imagePreview && <img src={imagePreview}></img>}
//     </>
//   );
// };
