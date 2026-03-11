import { useMemo, useState } from "react";
import { ChevronDown, Music } from "lucide-react";
import { useEventFormContext } from "../../context/EventFormContext";
import { FileUploadField } from "../ui/FileUpload";

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
  const [artistNameError, setArtistNameError] = useState("");
  const {
    selectedArtistIds,
    artistName,
    artistGenres,
    artistDescription,
    artistWebsiteUrl,
    artistMusicUrls,
    artistsLoading,
    createArtistMutationIsPending,
    artists,
    onArtistSelect,
    onArtistNameChange,
    onArtistGenreToggle,
    onArtistDescriptionChange,
    onArtistWebsiteUrlChange,
    onArtistMusicUrlChange,
    onAddArtistMusicUrl,
    onRemoveArtistMusicUrl,
    onArtistMainImageFileChange,
    showSavedArtistPreview,
    savedArtistPreview,
    onEditSavedArtist,
    onCreateArtist,
  } = useEventFormContext();

  const selectedIdsSet = useMemo(
    () => new Set(selectedArtistIds.map((id) => String(id))),
    [selectedArtistIds],
  );

  const selectedArtists = useMemo(
    () =>
      artists.filter((artist) => {
        const artistId = String(artist.id || artist._id || "");
        return selectedIdsSet.has(artistId);
      }),
    [artists, selectedIdsSet],
  );

  const selectedArtistLabel = useMemo(() => {
    if (selectedArtists.length === 0) return "Select one or more artists";
    if (selectedArtists.length <= 2) {
      return selectedArtists.map((artist) => artist.name).join(", ");
    }
    return `${selectedArtists[0].name}, ${selectedArtists[1].name} +${selectedArtists.length - 2}`;
  }, [selectedArtists]);

  const filteredArtists = useMemo(() => {
    const query = artistSearch.trim().toLowerCase();
    if (!query) {
      return artists;
    }

    return artists.filter((artist) => {
      const name = artist.name?.toLowerCase() ?? "";
      return name.includes(query);
    });
  }, [artistSearch, artists]);

  const handleSaveArtistClick = async () => {
    if (!artistName.trim()) {
      setArtistNameError("The artist name can not be empty");
      return;
    }

    setArtistNameError("");
    await onCreateArtist();
  };

  return (
    <div className="bg-purple/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Music className="h-6 w-6" />
        Artists * ({selectedArtistIds.length} selected)
      </h2>

      {/* Select Existing Artists */}
      {!showSavedArtistPreview &&
        (artistsLoading ? (
          <p className="text-gray-400 mb-4">Loading artists...</p>
        ) : (
          <div className="space-y-2 mb-6">
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
                <span>{selectedArtistLabel}</span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-300 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <div
                className={`mt-2 w-full rounded-lg border border-purple-500/40 shadow-xl overflow-hidden transition-all duration-300 ease-out ${
                  isDropdownOpen
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0 border-transparent"
                }`}
                style={{ backgroundColor: "#110b27" }}
              >
                <div className="p-3 border-b border-purple-500/20">
                  <input
                    type="text"
                    value={artistSearch}
                    onChange={(e) => setArtistSearch(e.target.value)}
                    placeholder="Search by artist name..."
                    className="w-full px-3 py-2 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                    style={{ backgroundColor: "#110b27" }}
                  />
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {filteredArtists.map((artist) => {
                    const artistId = String(artist.id || artist._id || "");
                    const isSelected = selectedIdsSet.has(artistId);

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

              {selectedArtists.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedArtists.map((artist) => {
                    const artistId = String(artist.id || artist._id || "");
                    return (
                      <span
                        key={`selected-${artistId}`}
                        className="inline-flex items-center rounded-full bg-purple-500/25 border border-purple-400/40 px-3 py-1 text-xs text-white"
                      >
                        {artist.name}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}

      {showSavedArtistPreview && savedArtistPreview ? (
        <div className="mb-4 rounded-lg border border-purple-500/30 bg-black/20 p-4">
          <p className="text-sm text-gray-300 mb-1">Saved Artist</p>
          {savedArtistPreview.mainImageUrl && (
            <img
              src={savedArtistPreview.mainImageUrl}
              alt={savedArtistPreview.name}
              className="mb-3 h-40 w-full rounded-lg object-cover border border-purple-500/30"
            />
          )}
          <p className="text-white font-semibold">{savedArtistPreview.name}</p>
          {savedArtistPreview.description && (
            <p className="text-sm text-gray-400 mt-1">
              {savedArtistPreview.description}
            </p>
          )}
          {savedArtistPreview.websiteUrl && (
            <p className="text-sm text-gray-400 mt-1">
              {savedArtistPreview.websiteUrl}
            </p>
          )}
          {savedArtistPreview.youtubeUrls.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-400 mb-1">YouTube URLs</p>
              <div className="flex flex-col gap-1">
                {savedArtistPreview.youtubeUrls.map((url, index) => (
                  <p key={`${url}-${index}`} className="text-sm text-gray-300">
                    {url}
                  </p>
                ))}
              </div>
            </div>
          )}
          {savedArtistPreview.genres.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {savedArtistPreview.genres.map((genre) => (
                <span
                  key={genre}
                  className="inline-flex items-center rounded-full bg-purple-500/25 border border-purple-400/40 px-3 py-1 text-xs text-white"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={onEditSavedArtist}
            className="mt-3 px-3 py-2 cursor-pointer rounded-lg bg-black/40 text-gray-200 hover:bg-black/60 border border-purple-500/30"
          >
            Edit
          </button>
        </div>
      ) : (
        <>
          {/* Artist Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Artist Name *
            </label>
            <input
              type="text"
              value={artistName}
              onChange={(e) => {
                onArtistNameChange(e.target.value);
                if (artistNameError) {
                  setArtistNameError("");
                }
              }}
              placeholder="e.g., The Rolling Stones"
              className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
            />
            {/* Create Artist Button */}
            {artistNameError && (
              <p className="text-sm text-red-400 mt-1 mb-2 ml-2">
                {artistNameError}
              </p>
            )}
          </div>

          {/* Create New Artist Form */}
          <div className="space-y-5 mb-4">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={artistDescription}
                onChange={(e) => onArtistDescriptionChange(e.target.value)}
                placeholder="Artist description"
                rows={3}
                className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none"
              />
            </div>

            {/* Music URLs */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                YouTube Url
              </label>
              <div className="space-y-2">
                {artistMusicUrls.map((musicUrl, index) => (
                  <div key={`music-url-${index}`} className="flex gap-2">
                    <input
                      type="url"
                      value={musicUrl}
                      onChange={(e) =>
                        onArtistMusicUrlChange(index, e.target.value)
                      }
                      placeholder="https://youtube.com/... or https://youtu.be/..."
                      className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
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

            {/* Website URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Website Url
              </label>
              <input
                type="url"
                value={artistWebsiteUrl}
                onChange={(e) => onArtistWebsiteUrlChange(e.target.value)}
                placeholder="https://artist-website.com"
                className="w-full px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            {/* Artist image upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Artist Image Upload
              </label>
              <FileUploadField
                uploadType="artistImage"
                onFileChange={onArtistMainImageFileChange}
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

            <button
              type="button"
              onClick={handleSaveArtistClick}
              disabled={createArtistMutationIsPending}
              className="w-full bg-purple-600 text-white mt-4 font-medium py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createArtistMutationIsPending ? "Creating..." : "Save Artist"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
