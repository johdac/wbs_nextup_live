import { Music } from "lucide-react";
import { useEventFormContext } from "../../context/EventFormContext";

const GENRES = [
  "classical",
  "electronic",
  "hiphop",
  "jazz",
  "pop",
  "rock",
  "world",
] as const;

export const ArtistLayout = () => {
  const {
    isCreatingNewArtist,
    selectedArtistIds,
    artistName,
    artistGenres,
    artistsLoading,
    createArtistMutationIsPending,
    artists,
    onToggleCreateNewArtist,
    onToggleSelectExistingArtist,
    onArtistSelect,
    onArtistNameChange,
    onArtistGenreToggle,
    onCreateArtist,
  } = useEventFormContext();
  return (
    <div className="bg-purple/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Music className="h-6 w-6" />
        Artists * ({selectedArtistIds.length} selected)
      </h2>

      {/* Toggle between Select Existing and Create New */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={onToggleSelectExistingArtist}
          className={`flex-1 cursor-pointer px-4 py-2 rounded-lg font-medium transition ${
            !isCreatingNewArtist
              ? "bg-purple-500 text-white"
              : "bg-black/40 text-gray-400 hover:bg-black/60"
          }`}
        >
          Select Existing
        </button>
        <button
          type="button"
          onClick={onToggleCreateNewArtist}
          className={`flex-1 cursor-pointer px-4 py-2 rounded-lg font-medium transition ${
            isCreatingNewArtist
              ? "bg-purple-500 text-white"
              : "bg-black/40 text-gray-400 hover:bg-black/60"
          }`}
        >
          Create New
        </button>
      </div>

      {!isCreatingNewArtist ? (
        <>
          {/* Select Existing Artists */}
          {artistsLoading ? (
            <p className="text-gray-400">Loading artists...</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {artists.map((artist) => {
                const artistId = artist.id || artist._id || "";
                const isSelected = selectedArtistIds.includes(artistId);

                return (
                  <div
                    key={artistId}
                    onClick={() => onArtistSelect(artistId)}
                    className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                      isSelected
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-purple-500/30 bg-black/20 hover:border-purple-500/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onArtistSelect(artistId)}
                        className="h-5 w-5 rounded border-purple-500 text-purple-500 focus:ring-purple-500 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">{artist.name}</p>
                        {artist.genres && artist.genres.length > 0 && (
                          <p className="text-gray-400 text-sm">
                            {artist.genres.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {artists.length === 0 && (
                <p className="text-gray-400 text-center py-8">
                  No artists available. Create artists first.
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Create New Artist Form */}
          <div className="space-y-3 mb-4">
            {/* Artist Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Artist Name *
              </label>
              <input
                type="text"
                value={artistName}
                onChange={(e) => onArtistNameChange(e.target.value)}
                placeholder="e.g., The Rolling Stones"
                className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            {/* Genre Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Genres * (select at least one)
              </label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => onArtistGenreToggle(genre)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      artistGenres.includes(genre)
                        ? "bg-purple-500 text-white"
                        : "bg-black/40 text-gray-400 hover:bg-black/60 border border-purple-500/30"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Create Artist Button */}
            <button
              type="button"
              onClick={onCreateArtist}
              disabled={createArtistMutationIsPending}
              className="w-full bg-purple-600 text-white font-medium py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createArtistMutationIsPending ? "Creating..." : "Save Artist"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
