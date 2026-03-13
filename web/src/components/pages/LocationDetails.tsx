import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { locationsService, type Location } from "../../services/locationsApi";
import { Link } from "lucide-react";
import { EventByLocation } from "../location/EventsByLocation";

export const VenueDetails = () => {
  const { id } = useParams<{ id: string }>();

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

  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(location.address)}&output=embed`;

  return (
    <div className="container mx-auto">
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
      <EventByLocation locationId={location.id || location.id || ""} />
    </div>
  );
};
