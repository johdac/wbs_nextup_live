import { useFileUpload } from "../../hooks/useFileUpload";

type Props = {
  uploadType: "avatar" | "eventImage" | "artistImage";
  onFileChange?: (file: File | null) => void;
  previewUrl?: string;
};

export function FileUploadField({
  uploadType,
  onFileChange,
  previewUrl,
}: Props) {
  const { file, preview, getRootProps, getInputProps, isDragActive } =
    useFileUpload(uploadType, previewUrl);

  if (file && onFileChange) {
    onFileChange(file);
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className="border border-gray-400 py-3 text-center cursor-pointer text-white rounded-lg"
      >
        <input {...getInputProps()} />

        {isDragActive ? (
          <p>Drop the file here...</p>
        ) : (
          <p>Drag & drop file here, or click</p>
        )}
      </div>

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="mt-4 max-h-48 object-contain"
        />
      )}
    </div>
  );
}
