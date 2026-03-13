type ArtistPreviewCardProps = {
  artistId: string;
  name: string;
  mainImageUrl?: string;
  genres: string[];
  canEdit?: boolean;
  onEdit?: () => void;
};

export const ArtistPreviewCard = ({
  artistId,
  name,
  mainImageUrl,
  genres,
  canEdit = false,
  onEdit,
}: ArtistPreviewCardProps) => {
  return (
    <div className="managed-card">
      <div className="flex items-center gap-4">
        <div className="w-full h-20 sm:w-30 sm:h-30 shrink-0 overflow-hidden rounded-md">
          <img
            src={mainImageUrl || "/placeholder.jpeg"}
            alt={name}
            onError={(e) => {
              const current = e.currentTarget;
              if (!current.src.endsWith("placeholder.jpeg")) {
                current.onerror = null;
                current.src = "/placeholder.jpeg";
              }
            }}
            className="h-full w-full rounded-lg object-cover border border-purple-500/30"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-white font-semibold">{name}</p>
          {genres.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {genres.map((genre) => (
                <span
                  key={`${artistId}-${genre}`}
                  className="inline-flex items-center rounded-full bg-purple-500/25 border border-purple-400/40 px-3 py-1 text-xs text-white"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        {canEdit && onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="px-3 py-2 cursor-pointer rounded-lg bg-black/40 text-gray-200 hover:bg-black/60 border border-purple-500/30"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};
