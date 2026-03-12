import { useMemo, useState } from "react";
import { Music } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEventFormContext } from "../../context/EventFormContext";
import { useAuth } from "../../context/AuthContext";
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
  const { user } = useAuth();
  const [artistSearch, setArtistSearch] = useState("");
  const [isCreatingArtist, setIsCreatingArtist] = useState(false);
  const [artistNameError, setArtistNameError] = useState("");
  const {
    selectedArtistIds,
    artistName,
    artistGenres,
    artistDescription,
    artistWebsiteUrl,
    artistMusicUrls,
    artistMainImagePreviewUrl,
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
    savedArtistPreviewId,
    savedArtistPreview,
    onEditSavedArtist,
    onLoadArtistForEdit,
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
    try {
      await onCreateArtist();
      setIsCreatingArtist(false);
    } catch {
      // Keep form open when save fails
    }
  };

  const currentUserId = user?._id ? String(user._id) : "";
  const showCreateArtistForm = isCreatingArtist && !showSavedArtistPreview;
  const selectedArtistsForPreview = useMemo(() => {
    if (!showSavedArtistPreview || !savedArtistPreviewId) {
      return selectedArtists;
    }

    return selectedArtists.filter(
      (artist) =>
        String(artist.id || artist._id || "") !== String(savedArtistPreviewId),
    );
  }, [selectedArtists, showSavedArtistPreview, savedArtistPreviewId]);

  const renderArtistPreviewCard = ({
    artistId,
    name,
    mainImageUrl,
    genres,
    canEdit,
    onEdit,
  }: {
    artistId: string;
    name: string;
    mainImageUrl?: string;
    genres: string[];
    canEdit: boolean;
    onEdit?: () => void;
  }) => {
    return (
      <div
        key={`selected-${artistId}`}
        className="flex justify-between items-center rounded-lg border border-purple-500/30 bg-black/20 p-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-full h-20 sm:w-30 sm:h-30 shrink-0 overflow-hidden rounded-md">
            <img
              src={mainImageUrl || "/placeholder.jpeg"}
              alt={name}
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

  return (
    <div className="bg-purple/30 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Music className="h-6 w-6" />
        Artists * ({selectedArtistIds.length} selected)
      </h2>

      {/* Select Existing Artists */}
      {!showCreateArtistForm &&
        (artistsLoading ? (
          <p className="text-gray-400 mb-4">Loading artists...</p>
        ) : (
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-300">
                Select Artists
              </label>
              <button
                type="button"
                onClick={() => setIsCreatingArtist(!isCreatingArtist)}
                className="px-3 py-2 cursor-pointer rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition"
              >
                + Create New Artist
              </button>
            </div>

            <div
              className="w-full rounded-lg border border-purple-500/40 shadow-xl overflow-hidden"
              style={{ backgroundColor: "#110b27" }}
            >
              {!showCreateArtistForm && (
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
              )}

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

                {!showCreateArtistForm &&
                  artists.length > 0 &&
                  filteredArtists.length === 0 && (
                    <p className="text-gray-400 text-center py-8">
                      No artists found for this search.
                    </p>
                  )}
              </div>
            </div>

            {!showCreateArtistForm && selectedArtistsForPreview.length > 0 && (
              <div className="mt-3 space-y-3">
                {selectedArtistsForPreview.map((artist) => {
                  const artistId = String(artist.id || artist._id || "");
                  const canEdit =
                    !!currentUserId &&
                    String(artist.createdById?._id || "") === currentUserId;
                  return renderArtistPreviewCard({
                    artistId,
                    name: artist.name,
                    mainImageUrl: artist.mainImageUrl,
                    genres: artist.genres,
                    canEdit,
                    onEdit: () => {
                      onLoadArtistForEdit(artistId);
                      setIsCreatingArtist(true);
                    },
                  });
                })}
              </div>
            )}
          </div>
        ))}

      {showSavedArtistPreview && savedArtistPreview ? (
        <div className="mb-4">
          {renderArtistPreviewCard({
            artistId: savedArtistPreview.name,
            name: savedArtistPreview.name,
            mainImageUrl: savedArtistPreview.mainImageUrl,
            genres: savedArtistPreview.genres,
            canEdit: true,
            onEdit: onEditSavedArtist,
          })}
        </div>
      ) : (
        <AnimatePresence initial={false}>
          {showCreateArtistForm ? (
            <motion.div
              key="create-artist-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {/* Create New Artist Form */}
              <div className="space-y-5 mb-4">
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
                    Music Resources
                  </label>
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
                          className="w-1/3 px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                        />
                        <input
                          type="url"
                          value={musicItem.url}
                          onChange={(e) =>
                            onArtistMusicUrlChange(index, "url", e.target.value)
                          }
                          placeholder="https://youtube.com/... or https://youtu.be/..."
                          className="w-2/3 px-3 py-2 bg-black/40 border border-purple-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
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
                    previewUrl={artistMainImagePreviewUrl}
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

                <div className="flex h-11 gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreatingArtist(false)}
                    className="flex-1 cursor-pointer  bg-black/40 text-gray-300 font-medium  rounded-lg hover:bg-black/60 border border-purple-500/30 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveArtistClick}
                    disabled={createArtistMutationIsPending}
                    className="flex-1 cursor-pointer bg-purple-600 text-white font-medium  rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createArtistMutationIsPending
                      ? "Creating..."
                      : "Save Artist"}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}
    </div>
  );
};
