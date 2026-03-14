import { FileUploadField } from "../ui/FileUpload";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";

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
        <Label htmlFor="artist-name" className="label-event-form mb-1">
          Artist Name *
        </Label>
        <Input
          id="artist-name"
          type="text"
          value={artistName}
          onChange={(e) => onArtistNameChange(e.target.value)}
          placeholder="e.g., The Rolling Stones"
          variant="event"
        />
        {artistNameError && (
          <p className="text-sm text-red-400 mt-1 mb-2 ml-2">
            {artistNameError}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="artist-description" className="label-event-form mb-1">
          Description
        </Label>
        <textarea
          id="artist-description"
          value={artistDescription}
          onChange={(e) => onArtistDescriptionChange(e.target.value)}
          placeholder="Artist description"
          rows={3}
          className="w-full input-event-form resize-none"
        />
      </div>

      <div>
        <Label className="label-event-form mb-2">Music Resources</Label>
        <div className="space-y-2">
          {artistMusicUrls.map((musicItem, index) => (
            <div key={`music-url-${index}`} className="flex gap-2">
              <Input
                id={`artist-music-title-${index}`}
                type="text"
                value={musicItem.title}
                onChange={(e) =>
                  onArtistMusicUrlChange(index, "title", e.target.value)
                }
                placeholder="Title (e.g. Live at Wembley)"
                variant="event"
                className="w-1/3"
              />
              <Input
                id={`artist-music-url-${index}`}
                type="url"
                value={musicItem.url}
                onChange={(e) =>
                  onArtistMusicUrlChange(index, "url", e.target.value)
                }
                placeholder="https://youtube.com/... or https://youtu.be/..."
                variant="event"
                className="w-2/3"
              />
              {artistMusicUrls.length > 1 && (
                <Button
                  type="button"
                  onClick={() => onRemoveArtistMusicUrl(index)}
                  variant="cancel"
                  size="md"
                >
                  -
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            onClick={onAddArtistMusicUrl}
            variant="secondary"
            size="md"
          >
            + Add more
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="artist-website-url" className="label-event-form mb-1">
          Website Url
        </Label>
        <Input
          id="artist-website-url"
          type="url"
          value={artistWebsiteUrl}
          onChange={(e) => onArtistWebsiteUrlChange(e.target.value)}
          placeholder="https://artist-website.com"
          variant="event"
        />
      </div>

      <div>
        <Label className="label-event-form mb-2">Artist Image Upload</Label>
        <FileUploadField
          uploadType="artistImage"
          onFileChange={onArtistMainImageFileChange}
          previewUrl={artistMainImagePreviewUrl}
        />
      </div>

      <div>
        <Label className="label-event-form mb-2">
          Genres * (select at least one)
        </Label>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Button
              key={genre}
              type="button"
              onClick={() => onArtistGenreToggle(genre)}
              variant={artistGenres.includes(genre) ? "secondary" : "cancel"}
              size="sm"
              className="text-sm"
            >
              {genre}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex h-11 gap-2 mt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="cancel"
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          variant="secondary"
          className="flex-1"
        >
          {isSaving ? "Saving..." : saveLabel}
        </Button>
      </div>
    </div>
  );
};
