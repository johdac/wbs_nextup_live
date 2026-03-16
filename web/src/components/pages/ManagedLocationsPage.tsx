import { useMemo, useState } from "react";
import { LocationCard } from "../location/LocationCard";
import { Heading } from "../ui/Heading";
import { useAuth } from "../../context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { locationsService } from "../../services/locationsApi";
import { ConfirmModal } from "../layout/ConfirmModal";
import { DeleteBtn } from "../buttons/DeleteBtn";
import { EditBtn } from "../buttons/EditBtn";

export const ManagedLocationsPage = () => {
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [error, setError] = useState("");

  const userId = user?._id ? String(user._id) : "";

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["managed-locations", userId],
    queryFn: () => locationsService.getLocations(userId),
    enabled: !!userId,
  });

  const sortedLocations = useMemo(
    () => [...locations].sort((a, b) => a.name.localeCompare(b.name)),
    [locations],
  );

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await locationsService.deleteLocation(itemToDelete);
      await queryClient.invalidateQueries({
        queryKey: ["managed-locations", userId],
      });
      setError("");
    } catch (err) {
      setError("Failed to delete location");
      console.error(err);
    } finally {
      setShowModal(false);
      setItemToDelete(null);
    }
  };

  return (
    <>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <Heading
            title="Managed Locations"
            subtitle="Update your saved locations"
          />
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
            {isLoading ? (
              <div className="py-12 text-center font-display text-lg text-white">
                Loading locations...
              </div>
            ) : sortedLocations.length === 0 ? (
              <p className="py-12 text-center font-display text-lg text-white">
                {error ? "Failed to load locations" : "No locations found"}
              </p>
            ) : (
              sortedLocations.map((loc) => {
                const locationId = String(loc.id || loc._id || "");
                return (
                  <LocationCard
                    key={locationId}
                    location={loc}
                    actionSlot={
                      <div className="flex gap-4">
                        <EditBtn data={loc} path="managed-locations" />
                        <DeleteBtn
                          id={locationId}
                          setItemToDelete={setItemToDelete}
                          setShowModal={setShowModal}
                        />
                      </div>
                    }
                  />
                );
              })
            )}
          </div>
        </div>
        <ConfirmModal
          name="location"
          handleDelete={handleDelete}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      </div>
    </>
  );
};
