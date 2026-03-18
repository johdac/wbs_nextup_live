import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { locationsService, type Location } from "../../services/locationsApi";
import { Link } from "lucide-react";
import { EventByLocation } from "../location/EventsByLocation";
import { Kicker } from "../ui/Kicker";
import { EditBtn } from "../buttons/EditBtn";
import { DeleteBtn } from "../buttons/DeleteBtn";
import { useAuth } from "../../context/AuthContext";
import { ConfirmModal } from "../layout/ConfirmModal";

export const SingleLocationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { signedIn, user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState("");

  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const mapEmbedUrl = `https://www.google.com/maps?q=${location.geo.coordinates[1]},${location.geo.coordinates[0]}&output=embed`;

  const locationOwnerId =
    location.organizerId ||
    (typeof location.createdById === "string"
      ? location.createdById
      : location.createdById?._id || location.createdById?.id || "");
  const isOwner =
    signedIn && Boolean(user?._id) && user?._id === locationOwnerId;

  const handleDelete = async () => {
    if (!isOwner) return;
    if (!itemToDelete) return;

    try {
      await locationsService.deleteLocation(itemToDelete);
      navigate("/managed-locations");
    } catch (err) {
      console.error(err);
    } finally {
      setShowModal(false);
      setItemToDelete("");
    }
  };

  return (
    <div className="container mx-auto">
      <div className="pb-20 max-w-8xl sm:px-0 flex flex-col justify-center items-center text-white">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-stretch w-full">
          {/* left */}
          <div className="flex flex-wrap sm:flex-nowrap items-start relative px-3">
            <div className="w-full overflow-hidden rounded-xl border-0 object-cover">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="400"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            {isOwner && (
              <div className="flex mt-2 gap-4 absolute bg-purple rounded-md top-5 right-0 px-2 pt-1 pb-1.5">
                <div className="flex items-center justify-end gap-3">
                  <EditBtn data={location} path="managed-locations" />
                  <DeleteBtn
                    id={location.id || location._id || ""}
                    setItemToDelete={setItemToDelete}
                    setShowModal={setShowModal}
                  />
                </div>
              </div>
            )}
          </div>
          {/* right */}
          <div className="flex flex-col items-start">
            <div className="pb-6">
              <Kicker text="Location" />
              <div className="flex flex-row gap-10 items-center pb-2">
                <h1>{location.name}</h1>
              </div>
            </div>
            <div>
              <p>{location.address}</p>
              <p>
                {location.zip} {location.city}
              </p>
              <p>{location.country}</p>
            </div>
            <div className="py-5">
              <a
                href={location.websiteUrl}
                className="flex flex-row gap-1 items-center text-lg underline cursor-pointer hover:text-purple"
              >
                <Link /> <div>Website</div>
              </a>
            </div>
          </div>
        </div>
        {isOwner && (
          <ConfirmModal
            name="location"
            handleDelete={handleDelete}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        )}
      </div>
      <EventByLocation locationId={location.id || location._id || ""} />
    </div>
  );
};
