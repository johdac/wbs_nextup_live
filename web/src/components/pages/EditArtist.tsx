import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Save, AlertCircle, Trash2 } from "lucide-react";
import { artistsService, type Artist, type UpdateArtistInput } from "../../services/artistsApi";
import { useAuth } from "../../context/AuthContext";
import { FileUploadField } from "../ui/FileUpload";

const GENRES = ["classical", "electronic", "hiphop", "jazz", "pop", "rock", "world"] as const;

export const EditArtist = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const passedArtist = location.state?.artist as Artist | undefined;

  const { setValue, watch, getValues } = useForm({
    defaultValues: {
      artistName: "",
      artistGenres: [] as string[],
      artistDescription: "",
      artistWebsiteUrl: "",
      artistMusicUrls: [""] as string[],
    },
  });

  const artistName = watch("artistName");
  const artistGenres = watch("artistGenres");
  const artistDescription = watch("artistDescription");
  const artistWebsiteUrl = watch("artistWebsiteUrl");
  const artistMusicUrls = watch("artistMusicUrls");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch artist details
  const { data: artist, isLoading } = useQuery({
    queryKey: ["artist", id],
    queryFn: () => (id ? artistsService.getArtistById(id) : null),
    enabled: !!id && !passedArtist,
  });

  const currentArtist = passedArtist || artist;

  // Initialize form with artist data
  useEffect(() => {
    if (currentArtist) {
      setValue("artistName", currentArtist.name || "");
      setValue("artistGenres", currentArtist.genres || []);
      setValue("artistDescription", currentArtist.description || "");
      setValue("artistWebsiteUrl", currentArtist.websiteUrl || "");
      setValue("artistMusicUrls", currentArtist.musicResources?.map((m) => m.url) || [""]);
    }
  }, [currentArtist, setValue]);

  // Update artist mutation
  const updateArtistMutation = useMutation({
    mutationFn: (data: UpdateArtistInput) =>
      id ? artistsService.updateArtist(id, data) : Promise.reject("No artist ID"),
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["artist", id] });
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      setTimeout(() => {
        navigate(`/managed-artists`);
      }, 1500);
    },
    onError: (err: Error | unknown) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error?.response?.data?.message || error?.message || "Failed to update artist");
    },
  });

  // Delete artist mutation
  const deleteArtistMutation = useMutation({
    mutationFn: () => (id ? artistsService.deleteArtist(id) : Promise.reject("No artist ID")),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      navigate("/managed-artists");
    },
    onError: (err: Error | unknown) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error?.response?.data?.message || error?.message || "Failed to delete artist");
    },
  });

  const handleSaveArtist = async () => {
    setError("");

    if (!artistName.trim()) {
      setError("Artist name is required");
      return;
    }

    if (artistGenres.length === 0) {
      setError("Please select at least one genre for the artist");
      return;
    }

    const updateData: UpdateArtistInput = {
      name: artistName,
      genres: artistGenres,
      description: artistDescription,
      websiteUrl: artistWebsiteUrl,
      musicResources: artistMusicUrls.filter(Boolean).map((url) => ({ url, title: url })),
    };

    updateArtistMutation.mutate(updateData);
  };

  const handleDeleteArtist = () => {
    deleteArtistMutation.mutate();
    setShowDeleteModal(false);
  };

  const handleToggleGenre = (genre: string) => {
    const prev = getValues("artistGenres");
    setValue("artistGenres", prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]);
  };

  const handleAddMusicUrl = () => {
    const prev = getValues("artistMusicUrls");
    setValue("artistMusicUrls", [...prev, ""]);
  };

  const handleRemoveMusicUrl = (index: number) => {
    const prev = getValues("artistMusicUrls");
    setValue(
      "artistMusicUrls",
      prev.filter((_, i) => i !== index),
    );
  };

  const handleMusicUrlChange = (index: number, value: string) => {
    const prev = getValues("artistMusicUrls");
    const updated = [...prev];
    updated[index] = value;
    setValue("artistMusicUrls", updated);
  };

  // Check if user is authorized to edit this artist
  const isAuthorized =
    !currentArtist?.createdById ||
    currentArtist.createdById._id === user?._id ||
    currentArtist.createdById._id === user?._id;

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (!currentArtist) return <div className="text-white">Artist not found</div>;
  if (!isAuthorized) return <div className="text-red-500">You are not authorized to edit this artist</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">Edit Artist</h1>
        <p className="text-gray-400">Update your artist information</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center gap-2 text-red-100">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-100">
          ✓ Artist updated successfully! Redirecting...
        </div>
      )}

      <div className="max-w-2xl bg-gray-900/50 p-8 rounded-lg space-y-6">
        {/* Artist Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Artist Name</label>
          <input
            type="text"
            value={artistName}
            onChange={(e) => setValue("artistName", e.target.value)}
            placeholder="Enter artist name"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
          <textarea
            value={artistDescription}
            onChange={(e) => setValue("artistDescription", e.target.value)}
            placeholder="Enter artist description"
            rows={4}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple"
          />
        </div>

        {/* Genres */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Genres</label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => handleToggleGenre(genre)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  artistGenres.includes(genre) ? "bg-purple text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Website URL */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
          <input
            type="url"
            value={artistWebsiteUrl}
            onChange={(e) => setValue("artistWebsiteUrl", e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple"
          />
        </div>

        {/* Music URLs */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Music URLs</label>
          <div className="space-y-2">
            {artistMusicUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleMusicUrlChange(index, e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple"
                />
                {artistMusicUrls.length > 1 && (
                  <button
                    onClick={() => handleRemoveMusicUrl(index)}
                    className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleAddMusicUrl}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
            >
              + Add Music URL
            </button>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Artist Image</label>
          <FileUploadField uploadType="artistImage" onFileChange={() => {}} />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <button
            onClick={handleSaveArtist}
            disabled={updateArtistMutation.isPending}
            className="flex-1 bg-linear-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {updateArtistMutation.isPending ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
