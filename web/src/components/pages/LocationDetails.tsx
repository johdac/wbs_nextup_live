import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { locationsService, type Location } from "../../services/locationsApi";
import { Link } from "lucide-react";
import { EventByLocation } from "../location/EventsByLocation";
import { Kicker } from "../ui/Kicker";

export const LocationDetails = () => {
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-stretch w-full">
          {/* left */}
          <div className="w-full overflow-hidden rounded-xl border-0 object-cover">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          {/* right */}
          <div className="flex flex-col items-start">
            <div className="pb-6">
              <Kicker text="Location" />
              <div className="flex flex-row gap-10 items-center pb-2">
                <h1>{location.name}</h1>
              </div>
            </div>

            {/* description */}
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
      </div>
      <EventByLocation locationId={location.id || location.id || ""} />
    </div>
  );
};
