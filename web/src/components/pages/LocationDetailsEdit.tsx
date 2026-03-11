import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { locationsService, type Location } from "../../services/locationsApi";
import { Link, Pencil, Trash2 } from "lucide-react";
import { EventByLocation } from "../layout/EventsByLocation";

export const VenueDetailsEdit = () => {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const handleDeleteEvent = async () => {
    if (!window.confirm("Are you sure you want to delete this location?")) {
      return;
    }

    try {
      setDeleteLoading(true);
      await locationsService.deleteLocation(id!);
      navigate("/managed-locations");
    } catch (err) {
      setError("Failed to delete location");
      setDeleteLoading(false);
    }
  };

  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(location.address)}&output=embed`;

  return (
    <div className="container mx-auto pb-10">
      {/* ACTION BUTTONS */}
      <div className="flex mt-2 sm:mt-0 sm:ml-auto gap-4 justify-end">
        <button
          className="px-5 border border-gray text-white font-bold py-2 rounded-lg flex items-center justify-center  hover:opacity-80 transition disabled:opacity-50 cursor-pointer"
          onClick={() =>
            navigate(`/managed-locations`, {
              state: { location },
            })
          }
        >
          <div className="flex flex-row pb-1 items-center text-white gap-1">
            <Pencil className="h-5 w-5" />
            <div className="text-lg">EDIT</div>
          </div>
        </button>
        <button
          className="px-5 border border-gray text-white font-bold py-2 rounded-lg flex items-center justify-center hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          onClick={handleDeleteEvent}
          disabled={deleteLoading}
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      <div className="pb-5 max-w-8xl sm:px-0 flex flex-col justify-center items-center text-white">
        <div className="w-full max-w-8xl mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* left */}
          <div className="w-full overflow-hidden rounded-lg border-0">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="260"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          {/* right */}
          <div className="flex flex-col items-start gap-3">
            <div className="grid">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase text-white">
                {location.name}
              </h1>
            </div>

            <div className="px-5 py-4 transition-all bg-gray-800/35">
              {/* description */}
              <p>{location.address}</p>
              <p>
                {location.zip} {location.city}
              </p>
            </div>
            <div>
              <a
                href={location.websiteUrl}
                className="flex flex-row gap-1 items-center text-lg underline cursor-pointer hover:text-purple"
              >
                <Link /> <div>Website</div>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* <EventByLocation locationId={location.id} /> */}
    </div>
  );
};
