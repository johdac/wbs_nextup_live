import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { eventsService, type EventCardLocation } from "../../services/eventsApi";
import { Link } from "lucide-react";
import { EventByLocation } from "../layout/EventsByLocation";

export const VenueDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [location, setLocation] = useState<EventCardLocation | null>(null);
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
        const data = await eventsService.getLocationById(id);
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

  return (
    <div className="container mx-auto">
      <div className="pb-5 max-w-8xl sm:px-0 flex flex-col justify-center items-center text-white">
        <div className="max-w-8xl mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* left */}
          <div className="grid grid-cols-1">{/* Map */}</div>
          {/* right */}
          <div className="md:col-span-2 flex flex-col items-start gap-3">
            <div className="grid grid-cols-2 md:grid-cols-3">
              <h1 className="md:col-span-2 flex items-end gap-3 text-4xl sm:text-5xl md:text-5xl font-black tracking-tight uppercase text-white">
                {location.name}
              </h1>
            </div>

            <div className="px-5 py-4 transition-all bg-gray-800/35">
              {/* description */}
              {location.address ? <div className="space-y-3">{location.address}</div> : null}
            </div>
            <div className="">
              <a
                href={location.city}
                className="flex flex-row gap-1 items-center text-lg underline cursor-pointer hover:text-purple"
              >
                <Link /> <div>Link</div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <EventByLocation locationId={location.id} />
    </div>
  );
};
