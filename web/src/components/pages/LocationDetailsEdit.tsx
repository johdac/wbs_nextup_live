import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { locationsService, type Location } from "../../services/locationsApi";
import { DeleteBtn } from "../buttons/DeleteBtn";
import { ConfirmModal } from "../layout/ConfirmModal";
import { GoBackBtn } from "../buttons/GoBackBtn";
import { EditBtn } from "../buttons/EditBtn";
import { LocationDetails } from "./LocationDetails";

export const LocationDetailsEdit = () => {
  const { id } = useParams<{ id: string }>();

  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Missing location id");
      setLoading(false);
      return;
    }

    const fetchLocation = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await locationsService.getLocationById(id);
        setLocation(data);
      } catch (err) {
        setError("Failed to load location");
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!location) return <p>Location not found</p>;

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await locationsService.deleteLocation(itemToDelete);
      // @todo: navigate to managed-locations once routing is confirmed
    } catch (err) {
      setError("Failed to delete this location");
      console.error(err);
    } finally {
      setShowModal(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between pb-5">
        <GoBackBtn path="/managed-events" />
        {/* ACTION BUTTONS */}
        <div className="flex mt-2 sm:mt-0 gap-3 justify-end">
          {/* error to be solved */}
          <EditBtn data={location} path="managed-locations" />
          <DeleteBtn id={location.id || ""} setItemToDelete={setItemToDelete} setShowModal={setShowModal} />
          <ConfirmModal name="artist" handleDelete={handleDelete} showModal={showModal} setShowModal={setShowModal} />
        </div>
      </div>
      <LocationDetails />
    </div>
  );
};
