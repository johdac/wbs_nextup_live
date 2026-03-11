import { useFileUpload } from "../../hooks/useFileUpload";

type Props = {
  uploadType: "avatar" | "eventImage" | "artistImage";
  onFileChange?: (file: File | null) => void;
};

export function FileUploadField({ uploadType, onFileChange }: Props) {
  const { file, preview, getRootProps, getInputProps, isDragActive } =
    useFileUpload(uploadType);

  if (file && onFileChange) {
    onFileChange(file);
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className="border py-4 text-center cursor-pointer text-white rounded-lg"
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
