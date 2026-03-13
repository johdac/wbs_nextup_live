import { FileUploadField } from "../ui/FileUpload";

type ArtistMusicItem = {
  title: string;
  url: string;
};

type ArtistFormProps = {
  artistName: string;
  artistDescription: string;
  artistWebsiteUrl: string;
  artistGenres: string[];
  artistMusicUrls: ArtistMusicItem[];
  artistMainImagePreviewUrl?: string;
  genres: readonly string[];
  artistNameError?: string;
  isSaving?: boolean;
  saveLabel?: string;
  onArtistNameChange: (value: string) => void;
  onArtistDescriptionChange: (value: string) => void;
  onArtistWebsiteUrlChange: (value: string) => void;
  onArtistGenreToggle: (genre: string) => void;
  onArtistMusicUrlChange: (
    index: number,
    field: "title" | "url",
    value: string,
  ) => void;
  onAddArtistMusicUrl: () => void;
  onRemoveArtistMusicUrl: (index: number) => void;
  onArtistMainImageFileChange: (file: File | null) => void;
  onCancel: () => void;
  onSave: () => void;
};

export const ArtistForm = ({
  artistName,
  artistDescription,
  artistWebsiteUrl,
  artistGenres,
  artistMusicUrls,
  artistMainImagePreviewUrl,
  genres,
  artistNameError,
  isSaving,
  saveLabel = "Save Artist",
  onArtistNameChange,
  onArtistDescriptionChange,
  onArtistWebsiteUrlChange,
  onArtistGenreToggle,
  onArtistMusicUrlChange,
  onAddArtistMusicUrl,
  onRemoveArtistMusicUrl,
  onArtistMainImageFileChange,
  onCancel,
  onSave,
}: ArtistFormProps) => {
  return (
    <div className="space-y-5 mb-4">
      <div className="mb-4">
        <label className="label-event-form mb-1">Artist Name *</label>
        <input
          type="text"
          value={artistName}
          onChange={(e) => onArtistNameChange(e.target.value)}
          placeholder="e.g., The Rolling Stones"
          className="w-full  input-event-form"
        />
        {artistNameError && (
          <p className="text-sm text-red-400 mt-1 mb-2 ml-2">
            {artistNameError}
          </p>
        )}
      </div>

      <div>
        <label className="label-event-form mb-1">Description</label>
        <textarea
          value={artistDescription}
          onChange={(e) => onArtistDescriptionChange(e.target.value)}
          placeholder="Artist description"
          rows={3}
          className="w-full input-event-form resize-none"
        />
      </div>

      <div>
        <label className="label-event-form mb-2">Music Resources</label>
        <div className="space-y-2">
          {artistMusicUrls.map((musicItem, index) => (
            <div key={`music-url-${index}`} className="flex gap-2">
              <input
                type="text"
                value={musicItem.title}
                onChange={(e) =>
                  onArtistMusicUrlChange(index, "title", e.target.value)
                }
                placeholder="Title (e.g. Live at Wembley)"
                className="w-1/3 input-event-form"
              />
              <input
                type="url"
                value={musicItem.url}
                onChange={(e) =>
                  onArtistMusicUrlChange(index, "url", e.target.value)
                }
                placeholder="https://youtube.com/... or https://youtu.be/..."
                className="w-2/3 input-event-form"
              />
              {artistMusicUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveArtistMusicUrl(index)}
                  className="px-3 py-2 rounded-lg bg-black/40 text-gray-300 hover:bg-black/60"
                >
                  -
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={onAddArtistMusicUrl}
            className="px-3 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600"
          >
            + Add more
          </button>
        </div>
      </div>

      <div>
        <label className="label-event-form mb-1">Website Url</label>
        <input
          type="url"
          value={artistWebsiteUrl}
          onChange={(e) => onArtistWebsiteUrlChange(e.target.value)}
          placeholder="https://artist-website.com"
          className="w-full input-event-form"
        />
      </div>

      <div>
        <label className="label-event-form mb-2">Artist Image Upload</label>
        <FileUploadField
          uploadType="artistImage"
          onFileChange={onArtistMainImageFileChange}
          previewUrl={artistMainImagePreviewUrl}
        />
      </div>

      <div>
        <label className="label-event-form mb-2">
          Genres * (select at least one)
        </label>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => onArtistGenreToggle(genre)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                artistGenres.includes(genre) ? "btn-tertiary" : "btn-cancel"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-11 gap-2 mt-4">
        <button type="button" onClick={onCancel} className="flex-1 btn-cancel">
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 btn-secondary"
        >
          {isSaving ? "Saving..." : saveLabel}
        </button>
      </div>
    </div>
  );
};
