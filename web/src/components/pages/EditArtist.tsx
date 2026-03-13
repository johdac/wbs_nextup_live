import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { artistsService, type CreateArtistInput, type UpdateArtistInput } from "../../services/artistsApi";
import { useAuth } from "../../context/AuthContext";
import { ArtistForm } from "../artists/ArtistForm";
import { EventFormContext } from "../../context/EventFormContext";

type ArtistMusicUrl = { title: string; url: string };

type ArtistFormValues = {
  artistName: string;
  artistGenres: string[];
  artistDescription: string;
  artistWebsiteUrl: string;
  artistMusicUrls: ArtistMusicUrl[];
};

export const EditArtist = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { setValue, watch, getValues } = useForm<ArtistFormValues>({
    defaultValues: {
      artistName: "",
      artistGenres: [],
      artistDescription: "",
      artistWebsiteUrl: "",
      artistMusicUrls: [{ title: "", url: "" }],
    },
  });

  const artistName = watch("artistName");
  const artistGenres = watch("artistGenres");
  const artistDescription = watch("artistDescription");
  const artistWebsiteUrl = watch("artistWebsiteUrl");
  const artistMusicUrls = watch("artistMusicUrls");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingArtistId, setEditingArtistId] = useState<string | null>(null);
  const [savedArtistPreview, setSavedArtistPreview] = useState<{
    name: string;
    mainImageUrl?: string;
    description?: string;
    websiteUrl?: string;
    genres: string[];
    musicResources: { title: string; url: string }[];
  } | null>(null);
  const [savedArtistPreviewId, setSavedArtistPreviewId] = useState<string | null>(null);
  const [showSavedArtistPreview, setShowSavedArtistPreview] = useState(false);
  const [artistMainImagePreviewUrl, setArtistMainImagePreviewUrl] = useState<string | undefined>(undefined);

  const { data: artists = [], isLoading: artistsLoading } = useQuery({
    queryKey: ["artists"],
    queryFn: () => artistsService.getArtists(),
  });

  const updateArtistMutation = useMutation({
    mutationFn: (data: UpdateArtistInput) =>
      editingArtistId ? artistsService.updateArtist(editingArtistId, data) : Promise.reject("No artist id"),
    onSuccess: (updatedArtist) => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      setSavedArtistPreviewId(updatedArtist.id || updatedArtist._id || null);
      setSavedArtistPreview({
        name: updatedArtist.name,
        mainImageUrl: updatedArtist.mainImageUrl,
        description: updatedArtist.description,
        websiteUrl: updatedArtist.websiteUrl,
        genres: updatedArtist.genres || [],
        musicResources: (updatedArtist.musicResources || []).map((item) => ({
          title: item.title || "",
          url: item.url,
        })),
      });
      setTimeout(() => {
        navigate("/managed-artists");
      }, 1500);
    },
    onError: (err: Error | unknown) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error?.response?.data?.message || error?.message || "Failed to update artist");
    },
  });

  const createArtistMutation = useMutation({
    mutationFn: (data: CreateArtistInput) => artistsService.createArtist(data),
    onSuccess: (newArtist) => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      setSavedArtistPreviewId(newArtist.id || newArtist._id || null);
      setSavedArtistPreview({
        name: newArtist.name,
        mainImageUrl: newArtist.mainImageUrl,
        description: newArtist.description,
        websiteUrl: newArtist.websiteUrl,
        genres: newArtist.genres || [],
        musicResources: (newArtist.musicResources || []).map((item) => ({
          title: item.title || "",
          url: item.url,
        })),
      });
      setTimeout(() => {
        navigate("/managed-artists");
      }, 1500);
    },
    onError: (err: Error | unknown) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error?.response?.data?.message || error?.message || "Failed to create artist");
    },
  });

  const handleSave = async () => {
    setError("");

    if (!artistName.trim()) {
      setError("Artist name is required");
      return;
    }

    if (artistGenres.length === 0) {
      setError("Please select at least one genre for the artist");
      return;
    }

    const musicResources = artistMusicUrls
      .filter((item) => item.url.trim())
      .map((item) => ({ url: item.url.trim(), title: item.title.trim() || "YouTube" }));

    const payload: UpdateArtistInput = {
      name: artistName,
      genres: artistGenres,
      description: artistDescription || undefined,
      websiteUrl: artistWebsiteUrl || undefined,
      musicResources: musicResources.length > 0 ? musicResources : undefined,
    };

    setIsSaving(true);
    try {
      if (editingArtistId) {
        await updateArtistMutation.mutateAsync(payload);
      } else {
        const createPayload: CreateArtistInput = {
          name: artistName,
          genres: artistGenres,
          description: artistDescription || undefined,
          websiteUrl: artistWebsiteUrl || undefined,
          musicResources: musicResources.length > 0 ? musicResources : undefined,
        };
        await createArtistMutation.mutateAsync(createPayload);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadArtistForEdit = (artistId: string) => {
    const target = artists.find((a) => String(a.id || a._id || "") === String(artistId));
    if (!target) return;

    setEditingArtistId(String(artistId));
    setValue("artistName", target.name || "");
    setValue("artistGenres", target.genres || []);
    setValue("artistDescription", target.description || "");
    setValue("artistWebsiteUrl", target.websiteUrl || "");
    setValue(
      "artistMusicUrls",
      target.musicResources?.length
        ? target.musicResources.map((item) => ({ title: item.title || "", url: item.url || "" }))
        : [{ title: "", url: "" }],
    );
    setArtistMainImagePreviewUrl(target.mainImageUrl || undefined);
  };

  const handleToggleGenre = (genre: string) => {
    const prev = getValues("artistGenres");
    setValue("artistGenres", prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]);
  };

  const handleAddMusicUrl = () => {
    const prev = getValues("artistMusicUrls");
    setValue("artistMusicUrls", [...prev, { title: "", url: "" }]);
  };

  const handleRemoveMusicUrl = (index: number) => {
    const prev = getValues("artistMusicUrls");
    setValue(
      "artistMusicUrls",
      prev.filter((_, i) => i !== index),
    );
  };

  const handleMusicUrlChange = (index: number, field: "title" | "url", value: string) => {
    const prev = getValues("artistMusicUrls");
    const next = [...prev];
    next[index] = {
      ...next[index],
      [field]: value,
    };
    setValue("artistMusicUrls", next);
  };

  const handleArtistMainImageFileChange = (file: File | null) => {
    if (artistMainImagePreviewUrl) {
      URL.revokeObjectURL(artistMainImagePreviewUrl);
      setArtistMainImagePreviewUrl(undefined);
    }
    if (file) {
      setArtistMainImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const isAuthorized = useMemo(() => {
    if (!user) return false;
    return true;
  }, [user]);

  const eventFormContextValue = {
    isCreatingNewLocation: false,
    selectedLocationId: "",
    locationName: "",
    locationAddress: "",
    locationCity: "",
    locationZip: "",
    locationCountry: "",
    locationLat: "",
    locationLng: "",
    isGeocodingLocation: false,
    locationsLoading: false,
    createLocationMutationIsPending: false,
    locations: [],
    selectedLocation: undefined,
    searchInput: "",
    searchResults: [],
    isSearching: false,
    showSearchResults: false,
    onToggleCreateNewLocation: () => {},
    onToggleSelectExistingLocation: () => {},
    onLocationSelect: () => {},
    onLocationNameChange: () => {},
    onLocationAddressChange: () => {},
    onLocationCityChange: () => {},
    onLocationZipChange: () => {},
    onLocationCountryChange: () => {},
    onCreateLocation: () => {},
    onMapClick: () => {},
    onLocationSearch: () => {},
    onSelectSearchResult: () => {},
    isCreatingNewArtist: !editingArtistId,
    selectedArtistIds: [],
    artistName,
    artistGenres,
    artistDescription,
    artistWebsiteUrl,
    artistMusicUrls,
    artistMainImagePreviewUrl,
    artistsLoading,
    createArtistMutationIsPending: isSaving,
    artists,
    onToggleCreateNewArtist: () => {
      setEditingArtistId(null);
      setValue("artistName", "");
      setValue("artistGenres", []);
      setValue("artistDescription", "");
      setValue("artistWebsiteUrl", "");
      setValue("artistMusicUrls", [{ title: "", url: "" }]);
      setArtistMainImagePreviewUrl(undefined);
      setShowSavedArtistPreview(false);
    },
    onToggleSelectExistingArtist: () => {
      setEditingArtistId(null);
      setShowSavedArtistPreview(false);
    },
    onArtistSelect: () => {
      // no-op for standalone artist edit page
    },
    onArtistNameChange: (value: string) => setValue("artistName", value),
    onArtistGenreToggle: handleToggleGenre,
    onArtistDescriptionChange: (value: string) => setValue("artistDescription", value),
    onArtistWebsiteUrlChange: (value: string) => setValue("artistWebsiteUrl", value),
    onArtistMusicUrlChange: handleMusicUrlChange,
    onAddArtistMusicUrl: handleAddMusicUrl,
    onRemoveArtistMusicUrl: handleRemoveMusicUrl,
    onArtistMainImageFileChange: handleArtistMainImageFileChange,
    showSavedArtistPreview,
    savedArtistPreviewId,
    savedArtistPreview,
    onEditSavedArtist: () => {
      if (savedArtistPreview) {
        setValue("artistName", savedArtistPreview.name || "");
        setValue("artistDescription", savedArtistPreview.description || "");
        setValue("artistWebsiteUrl", savedArtistPreview.websiteUrl || "");
        setValue("artistGenres", savedArtistPreview.genres || []);
        setValue(
          "artistMusicUrls",
          savedArtistPreview.musicResources?.length
            ? savedArtistPreview.musicResources.map((resource) => ({
                title: resource.title || "",
                url: resource.url,
              }))
            : [{ title: "", url: "" }],
        );
      }

      setShowSavedArtistPreview(false);
    },
    onLoadArtistForEdit: handleLoadArtistForEdit,
    onCancelArtistEdit: () => {
      setEditingArtistId(null);
      setShowSavedArtistPreview(false);
    },
    onCreateArtist: handleSave,
  };

  if (!isAuthorized) {
    return <div className="text-red-500">You are not authorized to edit artists</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">Edit Artist</h1>
        {editingArtistId && <p className="text-sm text-gray-400">Editing artist id: {editingArtistId}</p>}
        <p className="text-gray-400">Update the artist's details.</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center gap-2 text-red-100">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-100">
          Artist updated successfully! Redirecting...
        </div>
      )}

      <EventFormContext.Provider value={eventFormContextValue}>
        <div className="mb-6 rounded-lg border border-purple-500/30 bg-purple/30 p-6 backdrop-blur-sm">
          <ArtistForm
            artistName={artistName}
            artistDescription={artistDescription}
            artistWebsiteUrl={artistWebsiteUrl}
            artistGenres={artistGenres}
            artistMusicUrls={artistMusicUrls}
            artistMainImagePreviewUrl={artistMainImagePreviewUrl}
            genres={["Jazz", "Rock", "Pop", "Hip Hop", "Electronic", "Classical"]}
            artistNameError={!artistName.trim() ? "Artist name is required" : ""}
            isSaving={isSaving}
            saveLabel={editingArtistId ? "Update Artist" : "Save Artist"}
            onArtistNameChange={(value) => {
              setValue("artistName", value);
              if (error) setError("");
            }}
            onArtistDescriptionChange={(value) => setValue("artistDescription", value)}
            onArtistWebsiteUrlChange={(value) => setValue("artistWebsiteUrl", value)}
            onArtistGenreToggle={handleToggleGenre}
            onArtistMusicUrlChange={handleMusicUrlChange}
            onAddArtistMusicUrl={handleAddMusicUrl}
            onRemoveArtistMusicUrl={handleRemoveMusicUrl}
            onArtistMainImageFileChange={handleArtistMainImageFileChange}
            onCancel={() => {
              setEditingArtistId(null);
              setValue("artistName", "");
              setValue("artistGenres", []);
              setValue("artistDescription", "");
              setValue("artistWebsiteUrl", "");
              setValue("artistMusicUrls", [{ title: "", url: "" }]);
              setArtistMainImagePreviewUrl(undefined);
              setError("");
              setSuccess(false);
            }}
            onSave={handleSave}
          />
        </div>
      </EventFormContext.Provider>
    </div>
  );
};
