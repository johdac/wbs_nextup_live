import { useMemo, useState } from "react";
import { Music } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEventFormContext } from "../../context/EventFormContext";
import { useAuth } from "../../context/AuthContext";
import { ArtistPreviewCard } from "../artists/ArtistPreviewCard";
import { ArtistForm } from "../artists/ArtistForm";

const GENRES = ["classical", "electronic", "hiphop", "jazz", "pop", "rock", "world"] as const;

type ArtistLayoutProps = {
  mode?: "event" | "standalone";
};

export const ArtistLayout = ({ mode = "event" }: ArtistLayoutProps) => {
  const isStandalone = mode === "standalone";
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
    onCancelArtistEdit,
    onCreateArtist,
  } = useEventFormContext();

  const selectedIdsSet = useMemo(() => new Set(selectedArtistIds.map((id) => String(id))), [selectedArtistIds]);

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
      if (!isStandalone) {
        setIsCreatingArtist(false);
      }
    } catch {
      // Keep form open when save fails
    }
  };

  const currentUserId = user?._id ? String(user._id) : "";
  const showCreateArtistForm = isStandalone || (isCreatingArtist && !showSavedArtistPreview);
  const shouldShowSavedPreview = !isStandalone && showSavedArtistPreview && savedArtistPreview;
  const selectedArtistsForPreview = useMemo(() => {
    if (!showSavedArtistPreview || !savedArtistPreviewId) {
      return selectedArtists;
    }

    return selectedArtists.filter((artist) => String(artist.id || artist._id || "") !== String(savedArtistPreviewId));
  }, [selectedArtists, showSavedArtistPreview, savedArtistPreviewId]);

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
              <label className="block text-sm font-medium text-gray-300">Select Artists</label>
              <button
                type="button"
                onClick={() => setIsCreatingArtist(!isCreatingArtist)}
                className="px-3 py-2 cursor-pointer rounded-lg bg-primary text-white text-sm hover:bg-primary/25 transition"
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
                        <p className="text-white text-sm font-medium">{artist.name}</p>
                      </div>
                    </label>
                  );
                })}

                {artists.length === 0 && (
                  <p className="text-gray-400 text-center py-8">No artists available. Create artists first.</p>
                )}

                {!showCreateArtistForm && artists.length > 0 && filteredArtists.length === 0 && (
                  <p className="text-gray-400 text-center py-8">No artists found for this search.</p>
                )}
              </div>
            </div>

            {!showCreateArtistForm && selectedArtistsForPreview.length > 0 && (
              <div className="mt-3 space-y-3">
                {selectedArtistsForPreview.map((artist) => {
                  const artistId = String(artist.id || artist._id || "");
                  const canEdit = !!currentUserId && String(artist.createdById?._id || "") === currentUserId;
                  return (
                    <ArtistPreviewCard
                      key={`selected-${artistId}`}
                      artistId={artistId}
                      name={artist.name}
                      mainImageUrl={artist.mainImageUrl}
                      genres={artist.genres}
                      canEdit={canEdit}
                      onEdit={() => {
                        onLoadArtistForEdit(artistId);
                        setIsCreatingArtist(true);
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        ))}

      {shouldShowSavedPreview ? (
        <div className="mb-4">
          <ArtistPreviewCard
            artistId={savedArtistPreview.name}
            name={savedArtistPreview.name}
            mainImageUrl={savedArtistPreview.mainImageUrl}
            genres={savedArtistPreview.genres}
            canEdit
            onEdit={() => {
              onEditSavedArtist();
              setIsCreatingArtist(true);
            }}
          />
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
              <ArtistForm
                artistName={artistName}
                artistDescription={artistDescription}
                artistWebsiteUrl={artistWebsiteUrl}
                artistGenres={artistGenres}
                artistMusicUrls={artistMusicUrls}
                artistMainImagePreviewUrl={artistMainImagePreviewUrl}
                genres={GENRES}
                artistNameError={artistNameError}
                isSaving={createArtistMutationIsPending}
                saveLabel={createArtistMutationIsPending ? "Saving..." : "Save Artist"}
                onArtistNameChange={(value) => {
                  onArtistNameChange(value);
                  if (artistNameError) {
                    setArtistNameError("");
                  }
                }}
                onArtistDescriptionChange={onArtistDescriptionChange}
                onArtistWebsiteUrlChange={onArtistWebsiteUrlChange}
                onArtistGenreToggle={onArtistGenreToggle}
                onArtistMusicUrlChange={onArtistMusicUrlChange}
                onAddArtistMusicUrl={onAddArtistMusicUrl}
                onRemoveArtistMusicUrl={onRemoveArtistMusicUrl}
                onArtistMainImageFileChange={onArtistMainImageFileChange}
                onCancel={() => {
                  onCancelArtistEdit();
                  setArtistNameError("");
                  if (!isStandalone) {
                    setIsCreatingArtist(false);
                  }
                }}
                onSave={handleSaveArtistClick}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}
    </div>
  );
};
