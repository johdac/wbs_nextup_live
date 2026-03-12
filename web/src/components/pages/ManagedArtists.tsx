import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Pencil } from "lucide-react";
import { artistsService } from "../../services/artistsApi";
import { useAuth } from "../../context/AuthContext";
import { DeleteBtn } from "../buttons/DeleteBtn";

export const ManagedArtists = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?._id;

  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Fetch all artists but we'll filter by creator
  const { data: allArtists = [], isLoading: artistsLoading } = useQuery({
    queryKey: ["artists"],
    queryFn: artistsService.getArtists,
  });

  // Filter artists created by the current user
  const userArtists = allArtists.filter(
    (artist) => artist.createdById?._id === userId || artist.createdById?.username === user?.username,
  );

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await artistsService.deleteArtist(itemToDelete);
      navigate("/managed-artists");
    } catch (err) {
      console.error(err);
    } finally {
      setShowModal(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Managed Artists</h1>
          <p className="text-gray-400">Edit your artists</p>
        </div>

        {/* Artists List */}
        <div className="space-y-4">
          {/* <h2 className="text-2xl font-bold text-white mb-4">Your Artists ({userArtists.length})</h2> */}

          {artistsLoading && <p className="text-gray-400">Loading artists...</p>}

          {!artistsLoading && userArtists.length === 0 && (
            <p className="text-gray-400 text-center py-8">No artists created yet</p>
          )}

          {userArtists.map((artist) => (
            <div key={artist.id || artist._id} className="bg-gray-900/50 rounded-lg overflow-hidden">
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={artist.mainImageUrl || "/placeholder.svg"}
                  alt={artist.name}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="text-left">
                  <h3 className="text-lg font-bold text-white">{artist.name}</h3>
                  <p className="text-sm text-gray-400">{artist.genres?.join(", ")}</p>
                </div>
                {/* ACTION BUTTONS */}
                <div className="flex mt-2 sm:mt-0 sm:ml-auto gap-4">
                  <button
                    onClick={() =>
                      navigate(`/managed-artists/${artist.id}/edit`, {
                        state: { artist },
                      })
                    }
                  >
                    <div className="flex flex-row pb-1 items-center text-white gap-1 transition-colors duration-100 hover:text-purple">
                      <Pencil className="h-6 w-6" />
                      {/* <div className="text-lg">ALL</div> */}
                    </div>
                  </button>
                  <DeleteBtn
                    id={artist.id || artist._id || ""}
                    setItemToDelete={setItemToDelete}
                    setShowModal={setShowModal}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
