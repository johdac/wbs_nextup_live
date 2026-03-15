import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { artistsService, type Artist } from "../../services/artistsApi";
import { EditBtn } from "../buttons/EditBtn";
import { DeleteBtn } from "../buttons/DeleteBtn";
import { ConfirmModal } from "../layout/ConfirmModal";
import { GoBackBtn } from "../buttons/GoBackBtn";
import { ArtistDetails } from "./ArtistDetails";

export const ArtistDetailsEdit = () => {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Missing artist id");
      setLoading(false);
      return;
    }

    const fetchArtist = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await artistsService.getArtistById(id);
        setArtist(data);
      } catch (err) {
        setError("Failed to load artist");
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!artist) return <p>Artist not found</p>;

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await artistsService.deleteArtist(itemToDelete);
      navigate("/managed-artists");
    } catch (err) {
      setError("Failed to delete this artist");
      console.error(err);
    } finally {
      setShowModal(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="container mx-auto pb-10">
      <div className="flex justify-between pb-5">
        <GoBackBtn path="/managed-events" />
        {/* ACTION BUTTONS */}
        <div className="flex mt-2 sm:mt-0 gap-3 justify-end">
          {/* error to be solved */}
          <EditBtn data={artist} path="managed-artists" />
          <DeleteBtn id={artist.id || ""} setItemToDelete={setItemToDelete} setShowModal={setShowModal} />
          <ConfirmModal name="artist" handleDelete={handleDelete} showModal={showModal} setShowModal={setShowModal} />
        </div>
      </div>
      <ArtistDetails />
    </div>
  );
};
