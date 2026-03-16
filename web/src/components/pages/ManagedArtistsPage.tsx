import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { artistsService } from "../../services/artistsApi";
import { Heading } from "../ui/Heading";
import { ArtistCard } from "../artists/ArtistCard";
import { EditBtn } from "../buttons/EditBtn";
import { DeleteBtn } from "../buttons/DeleteBtn";
import { ConfirmModal } from "../layout/ConfirmModal";

export const ManagedArtistsPage = () => {
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [error, setError] = useState("");

  const userId = user?._id ? String(user._id) : "";

  const { data: artists = [], isLoading } = useQuery({
    queryKey: ["managed-artists", userId],
    queryFn: () => artistsService.getArtists(userId),
    enabled: !!userId,
  });

  const sortedArtists = useMemo(
    () => [...artists].sort((a, b) => a.name.localeCompare(b.name)),
    [artists],
  );

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await artistsService.deleteArtist(itemToDelete);
      await queryClient.invalidateQueries({
        queryKey: ["managed-artists", userId],
      });
      setError("");
    } catch (err) {
      setError("Failed to delete artist");
      console.error(err);
    } finally {
      setShowModal(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Heading title="Managed Artist" subtitle="Update your saved artists" />
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-6 grid-cols-1">
          {isLoading ? (
            <div className="py-12 text-center font-display text-lg text-white">
              Loading artists...
            </div>
          ) : sortedArtists.length === 0 ? (
            <p className="py-12 text-center font-display text-lg text-white">
              No artists found
            </p>
          ) : (
            sortedArtists.map((artist) => {
              const artistId = String(artist.id || artist._id || "");
              return (
                <ArtistCard
                  key={artistId}
                  artist={artist}
                  actionSlot={
                    <div className="flex gap-4">
                      <EditBtn data={artist} path="managed-artists" />
                      <DeleteBtn
                        id={artistId}
                        setItemToDelete={setItemToDelete}
                        setShowModal={setShowModal}
                      />
                    </div>
                  }
                />
              );
            })
          )}
        </div>
        <ConfirmModal
          name="artist"
          handleDelete={handleDelete}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      </div>
    </div>
  );
};
