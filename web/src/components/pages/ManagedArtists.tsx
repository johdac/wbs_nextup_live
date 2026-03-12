import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArtistForm } from "../artists/ArtistForm";
import { ArtistPreviewCard } from "../artists/ArtistPreviewCard";
import { useAuth } from "../../context/AuthContext";
import { artistsService, type Artist } from "../../services/artistsApi";
import { uploadFile } from "../../services/uploadApi";

const GENRES = [
  "classical",
  "electronic",
  "hiphop",
  "jazz",
  "pop",
  "rock",
  "world",
] as const;

const defaultMusicItem = { title: "", url: "" };

const isYoutubeUrl = (url: string) => {
  const normalized = url.trim().toLowerCase();
  if (!normalized) return true;
  return normalized.includes("youtube.com") || normalized.includes("youtu.be");
};

export const ManagedArtists = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArtistId, setEditingArtistId] = useState<string | null>(null);
  const [artistName, setArtistName] = useState("");
  const [artistDescription, setArtistDescription] = useState("");
  const [artistWebsiteUrl, setArtistWebsiteUrl] = useState("");
  const [artistGenres, setArtistGenres] = useState<string[]>([]);
  const [artistMusicUrls, setArtistMusicUrls] = useState([defaultMusicItem]);
  const [artistMainImageFile, setArtistMainImageFile] = useState<File | null>(
    null,
  );
  const [artistMainImagePreviewUrl, setArtistMainImagePreviewUrl] = useState<
    string | undefined
  >(undefined);
  const [artistNameError, setArtistNameError] = useState("");
  const [error, setError] = useState("");

  const userId = user?._id ? String(user._id) : "";

  const { data: artists = [], isLoading } = useQuery({
    queryKey: ["managed-artists", userId],
    queryFn: () => artistsService.getArtists(userId),
    enabled: !!userId,
  });

  const createArtistMutation = useMutation({
    mutationFn: artistsService.createArtist,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["managed-artists", userId],
      });
      setIsFormOpen(false);
      setEditingArtistId(null);
      resetForm();
    },
  });

  const updateArtistMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof artistsService.updateArtist>[1];
    }) => artistsService.updateArtist(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["managed-artists", userId],
      });
      setIsFormOpen(false);
      setEditingArtistId(null);
      resetForm();
    },
  });

  const isSaving =
    createArtistMutation.isPending || updateArtistMutation.isPending;

  const sortedArtists = useMemo(
    () => [...artists].sort((a, b) => a.name.localeCompare(b.name)),
    [artists],
  );

  const resetForm = () => {
    setArtistName("");
    setArtistDescription("");
    setArtistWebsiteUrl("");
    setArtistGenres([]);
    setArtistMusicUrls([defaultMusicItem]);
    setArtistMainImageFile(null);
    setArtistMainImagePreviewUrl(undefined);
    setArtistNameError("");
    setError("");
  };

  const openCreate = () => {
    setEditingArtistId(null);
    setIsFormOpen(true);
    resetForm();
  };

  const openEdit = (artist: Artist) => {
    setEditingArtistId(String(artist.id || artist._id || ""));
    setArtistName(artist.name || "");
    setArtistDescription(artist.description || "");
    setArtistWebsiteUrl(artist.websiteUrl || "");
    setArtistGenres(artist.genres || []);
    setArtistMusicUrls(
      artist.musicResources?.length
        ? artist.musicResources.map((resource) => ({
            title: resource.title || "",
            url: resource.url,
          }))
        : [defaultMusicItem],
    );
    setArtistMainImageFile(null);
    setArtistMainImagePreviewUrl(
      artist.mainImageUrl || artist.imageUrls?.[0] || undefined,
    );
    setArtistNameError("");
    setError("");
    setIsFormOpen(true);
  };

  const onSave = async () => {
    setError("");

    if (!artistName.trim()) {
      setArtistNameError("The artist name can not be empty");
      return;
    }

    if (artistGenres.length === 0) {
      setError("Please select at least one genre for the artist");
      return;
    }

    const normalizedResources = artistMusicUrls
      .map((item) => ({
        title: item.title.trim(),
        url: item.url.trim(),
      }))
      .filter((item) => item.url.length > 0);

    const invalidResource = normalizedResources.find(
      (resource) => !isYoutubeUrl(resource.url),
    );

    if (invalidResource) {
      setError("Music Url must be a valid YouTube link");
      return;
    }

    let mainImageKey = undefined;
    if (artistMainImageFile) {
      mainImageKey = await uploadFile(artistMainImageFile, "artistImage");
    }

    const payload = {
      name: artistName.trim(),
      description: artistDescription.trim() || undefined,
      websiteUrl: artistWebsiteUrl.trim() || undefined,
      genres: artistGenres,
      mainImageKey,
      musicResources:
        normalizedResources.length > 0
          ? normalizedResources.map((item) => ({
              title: item.title || "YouTube",
              url: item.url,
            }))
          : undefined,
    };

    if (editingArtistId) {
      await updateArtistMutation.mutateAsync({ id: editingArtistId, payload });
      return;
    }

    await createArtistMutation.mutateAsync(payload);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">
              Managed Artists
            </h1>
            <p className="text-gray-400">Edit your saved artists</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
          >
            + Create New Artist
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
            {error}
          </div>
        )}

        {isFormOpen && (
          <div className="mb-6 rounded-lg border border-purple-500/30 bg-purple/30 p-6 backdrop-blur-sm">
            <ArtistForm
              artistName={artistName}
              artistDescription={artistDescription}
              artistWebsiteUrl={artistWebsiteUrl}
              artistGenres={artistGenres}
              artistMusicUrls={artistMusicUrls}
              artistMainImagePreviewUrl={artistMainImagePreviewUrl}
              genres={GENRES}
              artistNameError={artistNameError}
              isSaving={isSaving}
              saveLabel={editingArtistId ? "Update Artist" : "Save Artist"}
              onArtistNameChange={(value) => {
                setArtistName(value);
                if (artistNameError) setArtistNameError("");
              }}
              onArtistDescriptionChange={setArtistDescription}
              onArtistWebsiteUrlChange={setArtistWebsiteUrl}
              onArtistGenreToggle={(genre) => {
                setArtistGenres((prev) =>
                  prev.includes(genre)
                    ? prev.filter((item) => item !== genre)
                    : [...prev, genre],
                );
              }}
              onArtistMusicUrlChange={(index, field, value) => {
                setArtistMusicUrls((prev) => {
                  const next = [...prev];
                  next[index] = {
                    ...next[index],
                    [field]: value,
                  };
                  return next;
                });
              }}
              onAddArtistMusicUrl={() =>
                setArtistMusicUrls((prev) => [...prev, { ...defaultMusicItem }])
              }
              onRemoveArtistMusicUrl={(index) =>
                setArtistMusicUrls((prev) => {
                  const next = prev.filter((_, i) => i !== index);
                  return next.length ? next : [{ ...defaultMusicItem }];
                })
              }
              onArtistMainImageFileChange={(file) => {
                setArtistMainImageFile(file);
                if (file) {
                  setArtistMainImagePreviewUrl(undefined);
                }
              }}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingArtistId(null);
                resetForm();
              }}
              onSave={onSave}
            />
          </div>
        )}

        {isLoading ? (
          <p className="text-gray-400">Loading artists...</p>
        ) : sortedArtists.length === 0 ? (
          <p className="text-gray-400">You have no artists yet.</p>
        ) : (
          <div className="space-y-3">
            {sortedArtists.map((artist) => {
              const artistId = String(artist.id || artist._id || "");
              return (
                <ArtistPreviewCard
                  key={artistId}
                  artistId={artistId}
                  name={artist.name}
                  mainImageUrl={artist.mainImageUrl}
                  genres={artist.genres}
                  canEdit
                  onEdit={() => openEdit(artist)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
