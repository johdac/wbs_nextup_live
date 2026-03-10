import { useMemo, useState } from "react";
import { ChevronDown, Music } from "lucide-react";
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
  const [artistSearch, setArtistSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const filteredArtists = useMemo(() => {
    const query = artistSearch.trim().toLowerCase();
    if (!query) {
      return artists;
    }

    return artists.filter((artist) => {
      const name = artist.name?.toLowerCase() ?? "";
      const genres = artist.genres?.join(" ").toLowerCase() ?? "";
      return name.includes(query) || genres.includes(query);
    });
  }, [artistSearch, artists]);

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
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Select Artists
              </label>

              <div>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="w-full px-4 py-3 border border-purple-500/50 rounded-lg text-white focus:outline-none focus:border-purple-500 transition flex items-center justify-between"
                  style={{ backgroundColor: "#110b27" }}
                >
                  <span>
                    {selectedArtistIds.length > 0
                      ? `${selectedArtistIds.length} artist${selectedArtistIds.length > 1 ? "s" : ""} selected`
                      : "Select one or more artists"}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-300 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <div
                  className={`mt-2 w-full rounded-lg border border-purple-500/40 shadow-xl overflow-hidden transition-all duration-300 ease-out ${
                    isDropdownOpen
                      ? "max-h-90 opacity-100"
                      : "max-h-0 opacity-0 border-transparent"
                  }`}
                  style={{ backgroundColor: "#110b27" }}
                >
                  <div className="p-3 border-b border-purple-500/20">
                    <input
                      type="text"
                      value={artistSearch}
                      onChange={(e) => setArtistSearch(e.target.value)}
                      placeholder="Search by artist name or genre..."
                      className="w-full px-3 py-2 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                      style={{ backgroundColor: "#110b27" }}
                    />
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {filteredArtists.map((artist) => {
                      const artistId = artist.id || artist._id || "";
                      const isSelected = selectedArtistIds.includes(artistId);

                      return (
                        <label
                          key={artistId}
                          className="w-full flex items-start gap-3 px-4 py-3 hover:bg-purple-500/20 border-b border-purple-500/20 last:border-b-0 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onArtistSelect(artistId)}
                            className="mt-1 h-4 w-4 rounded border-purple-500 text-purple-500 focus:ring-purple-500"
                          />
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">
                              {artist.name}
                            </p>
                            {artist.genres && artist.genres.length > 0 && (
                              <p className="text-gray-400 text-xs">
                                {artist.genres.join(", ")}
                              </p>
                            )}
                          </div>
                        </label>
                      );
                    })}

                    {artists.length === 0 && (
                      <p className="text-gray-400 text-center py-8">
                        No artists available. Create artists first.
                      </p>
                    )}

                    {artists.length > 0 && filteredArtists.length === 0 && (
                      <p className="text-gray-400 text-center py-8">
                        No artists found for this search.
                      </p>
                    )}
                  </div>
                </div>
              </div>
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
