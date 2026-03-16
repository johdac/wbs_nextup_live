import { useParams } from "react-router";
import { locationsService } from "../../services/locationsApi";
import { GoBackBtn } from "../buttons/GoBackBtn";
import { ManagedLocations } from "./ManagedLocations";
import { useEffect, useState } from "react";

export const EditLocation = () => {
  const { id } = useParams<{ id: string }>();

  const [preselectedLocationId, setPreselectedLocationId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

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
        if (!isMounted) {
          return;
        }

        setPreselectedLocationId(String(data.id || data._id || id));
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError("Failed to load location");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLocation();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <div className="container mx-auto pb-10">
      <div className="flex justify-between">
        <GoBackBtn path="/managed-locations" />
      </div>

      {loading ? (
        <p className="py-8 text-center text-white">Loading...</p>
      ) : error ? (
        <p className="py-8 text-center text-red-400">{error}</p>
      ) : preselectedLocationId ? (
        <ManagedLocations preselectedLocationId={preselectedLocationId} />
      ) : (
        <p className="py-8 text-center text-white">Location not found</p>
      )}
    </div>
  );
};
