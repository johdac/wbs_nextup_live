import { useParams } from "react-router";
import { locationsService } from "../../services/locationsApi";
import type { Location as AppLocation } from "../../services/locationsApi";
import { GoBackBtn } from "../buttons/GoBackBtn";
import { ManagedLocations } from "./ManagedLocations";
import { useEffect, useState } from "react";

export const EditLocation = () => {
  const { id } = useParams<{ id: string }>();

  const [location, setLocation] = useState<AppLocation | null>(null);
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

  return (
    <div className="container mx-auto pb-10">
      <div className="flex justify-between">
        <GoBackBtn path="/managed-events" />
      </div>
      <ManagedLocations
        preselectedLocationId={location.id || location._id || ""}
      />
    </div>
  );
};
